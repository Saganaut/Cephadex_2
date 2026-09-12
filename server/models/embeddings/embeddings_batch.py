import asyncio
import logging

import redis.asyncio as redis_async

from models.embeddings.dependencies import Llm
from models.embeddings.embeddings import EmbeddingsProcessor
from models.jobs.job_schema import EmbeddingSchema, PromptSchema
from models.jobs.redis import async_pool

log = logging.getLogger("App")


class EmbeddingsBatch:
    def __init__(self, slug: str):
        self.slug: str = slug
        self.jobs: list[EmbeddingSchema] = []
        self.batched_pages: dict[str, list[EmbeddingSchema]] = {}
        self.pages: list[EmbeddingSchema] = []

    def add_job(self, job: EmbeddingSchema) -> None:
        self.jobs.append(job)

    async def process(self) -> None:
        batched_pages = {}
        for job in self.jobs:
            page = job.page
            if page not in batched_pages:
                batched_pages[page] = []
            batched_pages[page].append(job)
        if batched_pages:
            tasks = [self.process_page(page, jobs) for page, jobs in batched_pages.items()]
            await asyncio.gather(*tasks)

        await self.process_document()

    async def process_page(self, page: int, jobs: list[EmbeddingSchema]) -> None:
        async with redis_async.Redis(connection_pool=async_pool) as r_client:
            llm = Llm()
            processor = EmbeddingsProcessor()
            ## embed all the pages chunks
            await processor.create_rows_in_db(jobs, page)
            ## need to change this to summarize them first

            for job in jobs:
                prompt_raw = f"""Provide a brief and concise summary, use as few words as possible
                but include key terms and logic. The page {job.text}: \n"""

                prompt = PromptSchema(
                    prompt=prompt_raw,
                    type="embedding",
                    subtype="summary",
                )

                text = await llm.summarize(prompt)
                if text is None:
                    text = ""
                job.text = text

            await processor.process_embeddings(jobs, r_client, page, "chunk")

            ## assemble the embeddings into a page
            text = ""
            for job in jobs:
                text += job.text
            summary_embedding = EmbeddingSchema(
                slug=jobs[0].slug,
                user_id=jobs[0].user_id,
                type="page",
                deck_id=jobs[0].deck_id,
                text="",
                item_number=page,
                page=page,
                item_quantity=len(jobs),
                source=jobs[0].source,
                embedding=[],
                document=jobs[0].document,
                file_id=jobs[0].file_id,
                subject=jobs[0].subject,
                topic=jobs[0].topic,
                state="processing",
            )
            ## summarize the page

            prompt = PromptSchema(
                prompt=prompt_raw,
                type="embedding",
                subtype="summary",
            )

            summary = await llm.summarize(prompt)
            if summary is None:
                msg = f"Summary is None for {summary_embedding.slug}"
                raise ValueError(msg)
            summary_embedding.text = summary
            await processor.process_embeddings(
                [summary_embedding],
                r_client,
                page,
                "page",
            )
            self.pages.append(summary_embedding)

    async def process_document(self) -> None:
        text = ""
        for summary in self.pages:
            text += summary.text

        llm = Llm()
        prompt = f"""Provide a brief and concise summary, use as few words as possible but
        include key terms and logic. The page {text}: \n"""
        prompt = PromptSchema(prompt=prompt, type="embedding", subtype="summary")
        summary = await llm.summarize(prompt)
        if summary is None:
            msg = f"Summary is None for {self.slug}"
            raise ValueError(msg)
        document_embedding = EmbeddingSchema(
            slug=self.slug,
            user_id=self.jobs[0].user_id,
            type="document",
            deck_id=self.jobs[0].deck_id,
            text=summary,
            item_number=0,
            item_quantity=len(self.pages),
            source=self.jobs[0].source,
            embedding=[],
            document=self.jobs[0].document,
            file_id=self.jobs[0].file_id,
            subject=self.jobs[0].subject,
            topic=self.jobs[0].topic,
            state="processing",
        )
        processor = EmbeddingsProcessor()
        async with redis_async.Redis(connection_pool=async_pool) as r_client:
            await processor.process_embeddings(
                [document_embedding],
                r_client,
                0,
                "document",
            )


## create all the embeddings for the chunks
## re-assemble the embeddings into pages, summarize the pages --> create new job
