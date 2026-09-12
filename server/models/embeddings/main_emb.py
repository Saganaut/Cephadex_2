# import asyncio

# import redis.asyncio as redis_async

# from dependencies.settings import get_settings
# from models.embeddings.dependencies import Embedder, Llm, Matcher
# from models.embeddings.search import EmbeddingsSearch
# from models.jobs.job_schema import ChatQuerySchema

# settings = get_settings()


# r = redis_async.Redis(
#     host=settings.redis.host,
#     port=settings.redis.port,
#     password=settings.redis.password,
#     decode_responses=True,
# )
# query = ChatQuerySchema(query="What can I do with Cephadex?", user_id=1)
# embeddings = EmbeddingsSearch(query, r, Embedder, Matcher, Llm)


# def main():
#     asyncio.run(embeddings.search())


# if __name__ == "__main__":
#     main()
