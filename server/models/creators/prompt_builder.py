import logging

from models.exceptions.creator_exceptions import CreatorExceptions
from models.jobs.job_schema import PayloadSchema, PromptSchema

from .prompts.prompts import (
    create_new_card_prompt,
    len_choices,
    prompt_choices,
    prompt_from_scratch,
    regen_choices,
)

logger = logging.getLogger("job_processing")


## TODO: refactor and test this - quite important to get right
class PromptBuilder:
    @staticmethod
    def build_prompt_structure_for_cards(card_type: str) -> str:
        extract_from = prompt_choices["Common"]["ExtractFrom"]  ## 1
        general_format = prompt_choices["Common"]["GeneralFormat"]  ## 3
        format_emphasis = prompt_choices["Common"]["FormatEmphasis"]
        main_order = prompt_choices[card_type]["MainOrder"]  ## 2
        format_specifications = prompt_choices[card_type]["FormatSpecifications"]  ## 4
        latex = prompt_choices["Common"]["Latex"]
        markdown = prompt_choices["Common"]["Markdown"]
        order_reinforcement = prompt_choices[card_type]["OrderReinforcement"]  ## 5
        example = prompt_choices[card_type]["Example"]  ## 6
        passage_annoucement = prompt_choices["Common"]["PassageAnnouncement"]
        return f"""{extract_from} {main_order} {general_format} {format_specifications} {latex}
        {markdown} \n {format_emphasis} {order_reinforcement} {example}
        \n {passage_annoucement} \n"""

    @staticmethod
    def build_create_new_cards_prompt(data: dict) -> PromptSchema:
        prompt = create_new_card_prompt[data["category"]]
        if data["language"] is not None:
            data["language"] = f"Return the results in {data['language']} only."
        for key, value in data.items():
            if value is not None:
                prompt = prompt.replace(f"{{{key}}}", value)

        return PromptSchema(prompt=prompt, type="new_card", subtype=data["category"])

    @staticmethod
    def build_add_more_cards_prompt(
        subject: str,
        topic: str,
        concepts: str,
        grade: str,
        language: str,
        extract_type: str = "Mcq",
    ) -> PromptSchema:
        placeholders = {
            "subject": subject,
            "topic": topic,
            "concepts": concepts,
            "grade": grade,
            "lang": f"Return the results in {language} only.",
        }
        prompt = prompt_from_scratch.get(extract_type, "")
        latex = prompt_choices["Common"]["Latex"]
        markdown = prompt_choices["Common"]["Markdown"]
        prompt = f"""{prompt} {latex} {markdown}"""
        for placeholder, value in placeholders.items():
            if value is not None:
                prompt = prompt.replace(f"{{{placeholder}}}", value)
        return PromptSchema(prompt=prompt, type="extract", subtype="add_cards")

    @staticmethod
    def build_prompt_why_wrong(ww_prompt: dict) -> PromptSchema:
        subject = ww_prompt.get("subject", "")
        if subject == "Unspecified":
            subject = ""
        term = ww_prompt["term"]
        content = ww_prompt.get("content", "")
        boc_2 = ww_prompt.get("boc_2", "")
        boc_3 = ww_prompt.get("boc_3", "")
        boc_4 = ww_prompt.get("boc_4", "")
        category = ww_prompt["category"]

        subject_opt_template = (
            f"You are a helpful teacher who wants to help students learn {subject}."
        )
        mcq_template = (
            f"The student has just answered this multiple choice question incorrectly: {term}. "
            f"The student asks you why this answer is correct: {content}, "
            f"whereas these are wrong {boc_2} and {boc_3} and {boc_4}. "
            "You respond:"
        )
        other_template = (
            f"The student is studying flashcards and doesn't understand why {content} "
            f"is the appropriate answer to this question: {term}. "
            f"The student asks you why this answer is correct: {content} "
            "You respond:"
        )

        subject_opt = subject_opt_template.format(subject_opt=subject) if subject else ""
        prompt = f"{subject_opt} {mcq_template if category == 'Mcq' else other_template}"

        placeholders = {
            "{term}": term,
            "{content}": content,
            "{boc_2}": boc_2,
            "{boc_3}": boc_3,
            "{boc_4}": boc_4,
        }

        for placeholder, value in placeholders.items():
            if value is not None:
                prompt = prompt.replace(placeholder, value)
        return PromptSchema(prompt=prompt, type="chatbot", subtype="why_wrong")

    @staticmethod
    def question_prompt_builder(
        term: str,
        content: str,
        latest_paragraph: str,
        question: str,
    ) -> PromptSchema:
        prompt = "{paragraph}.  The student has asks you the following {question}, which may or may not be related to your previous interaction. You respond:"  # noqa: E501
        prompt = prompt.replace("{term}", term)
        prompt = prompt.replace("{content}", content)

        paragraph = ""
        if latest_paragraph:
            paragraph = f"You have previously told the student that {latest_paragraph}."
        prompt = prompt.replace("{paragraph}", paragraph)

        final_prompt = prompt.replace("{question}", question)

        return PromptSchema(prompt=final_prompt, type="chatbot", subtype="question")

    @staticmethod
    def build_prompt_explain_more(
        term: str,
        subject: str = "any",
        content: str = "None",  # noqa: ARG004
    ) -> PromptSchema:
        prompt = """You are a helpful teacher who wants to help students learn
        {subject_opt}. A student asks you to explain {term} in detail. You respond: """
        prompt = prompt.replace("{term}", term)
        if subject is not None:
            prompt = prompt.replace("{subject_opt}", subject)
        return PromptSchema(prompt=prompt, type="chatbot", subtype="explain")

    @staticmethod
    def build_prompt_regen(term: str, prompt_options: dict) -> PromptSchema:
        if prompt_options["main_opt"] not in regen_choices:
            msg = "Invalid prompt option"
            raise ValueError(msg)
        prompt = regen_choices[prompt_options["main_opt"]]
        if prompt_options["subject_opt"] is not None:
            subject = "related to the subject of " + prompt_options["subject_opt"]
        else:
            subject = ""
        if prompt_options["lang_opt"] is not None:
            lang = f"The language used should be {prompt_options['lang_opt']} only"
        else:
            lang = ""
        if prompt_options["detail_lvl_opt"]:
            detail = len_choices[prompt_options["detail_lvl_opt"]]
        else:
            detail = ""
        trans_opt = prompt_options["trans_opt"] if prompt_options["trans_opt"] else ""
        prompt = (
            prompt.replace("{length}", detail)
            .replace("{lang}", lang)
            .replace("{trans}", trans_opt)
            .replace("{term}", term)
            .replace("{subject}", subject)
        )
        return PromptSchema(
            prompt=prompt,
            type="regen",
            subtype=prompt_options["main_opt"],
        )

    @staticmethod
    def build_prompt(payload: PayloadSchema) -> PromptSchema:  # noqa: C901, PLR0912
        if not payload.card_type:
            raise CreatorExceptions.MissingPromptOptionError
        if payload.card_type.value not in prompt_choices:
            raise CreatorExceptions.InvalidPromptOptionError(payload.card_type)
        prompt = PromptBuilder.build_prompt_structure_for_cards(payload.card_type)
        logger.debug("/n /n PROMPT: %s", prompt)
        if payload.subject is not None:
            subject = "related to the subject of " + payload.subject.value
        else:
            subject = ""
        if payload.language is not None:
            lang = f"The language used should be {payload.language.value} only"
        else:
            lang = ""
        if payload.detail_lvl is not None:
            detail = len_choices[str(payload.detail_lvl.value).lower()]
            if detail == "High":
                detail = "detailed and extensive"
            elif detail == "Medium":
                detail = ""
            elif detail == "Low":
                detail = "brief"
        else:
            detail = ""
        if payload.min is not None:
            qmin = "at least " + payload.min
        else:
            qmin = "at least 10"
        if payload.max is not None:
            qmax = ", and at most " + payload.max
        else:
            qmax = ""
        if payload.card_type.value == "Translate" and payload.language is not None:
            trans_opt = payload.language.value
        else:
            trans_opt = ""
        if payload.custom_front:
            custom_term = payload.custom_front
        else:
            custom_term = ""
        if payload.custom_back:
            custom_content = payload.custom_back
        else:
            custom_content = ""
        prompt = (
            prompt.replace("{qmin}", qmin)
            .replace("{subject}", subject)
            .replace("{qmax}", qmax)
            .replace("{length}", detail)
            .replace("{lang}", lang)
            .replace("{trans}", trans_opt)
            .replace("{custom_term}", custom_term)
            .replace("{custom_content}", custom_content)
        )

        return PromptSchema(
            prompt=prompt,
            type="extract",
            subtype=payload.card_type.value,
        )

    @staticmethod
    def claude_notes_prompt_builder(text: str, language: str) -> PromptSchema:
        prompt = f""" <Text>{text} </Text> Take the passage above wihtin the <Text> </Text> tags
        and turn into notes following the Cornell {language} notes taking method
        (which means it should include essential questions, questions, notes and
        a summary) format it using Markdown, using headers, lists, tables where appropriate,
        additionally ensure scientific formulas are in LaTeX format.
        Use whitespace to separate sections.
        Remove any footnote references.
        Come up witj a suitable title for it.  Do not include the words Cornell Notes.
       Return the processed directly, do not return anything else than the processed
       text with its markup.  /n"""
        return PromptSchema(prompt=prompt, type="long_form", subtype="notes")

    @staticmethod
    def claude_reformat_prompt_builder(text: str, language: str) -> PromptSchema:
        prompt = f""" <Text>{text} </Text> Take the passage above within the <Text> </Text>
        tags and reformat it {language} using Markdown, using headers, lists, tables where
        appropriate, additionally ensure scientific formulas are in LaTeX format.
        Fix any grammar or syntax issues you notice.
        Use whitespace to separate sections.
        Return the processed directly, do not return anything else than
        the processed text with its markup.  /n"""
        return PromptSchema(prompt=prompt, type="long_form", subtype="reformat")
