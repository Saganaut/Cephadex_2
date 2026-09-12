import logging

from models.decks.deck.deck import Deck
from models.helpers.log_decorators import job_log_decorator
from sqlalchemy.ext.asyncio import AsyncSession

from .card import Card

processing_logger = logging.getLogger("job_processing")


class CardFactory:
    def __init__(self, session: AsyncSession, deck: Deck):
        self.session: AsyncSession = session
        self.deck: Deck = deck  #! Need to make sure this loads cards too
        self.card_counter: int = 0

    def create_cards(self, content: list, category: str) -> None:
        if category == "Mcq":
            self.create_mcq(content)
        elif category == "Formulas":
            self.create_formulas(content)
        elif category == "Discuss":
            self.create_discuss(content)
        else:
            self.create_default(content, category)

    @job_log_decorator
    async def async_create_cards(self, content, category: str) -> int:
        if not (isinstance(content, list)):
            content = [content]
        if category == "Mcq":
            await self.async_create_mcq(content)
        elif category == "Formulas":
            await self.async_create_formulas(content)
        elif category == "Discuss":
            await self.async_create_discuss(content)
        else:
            await self.async_create_default(content, category)
        return self.card_counter

    def create_default(self, content: list, type: str) -> None:
        for item in content:
            try:
                key = item["A"]
                if not self.check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=capitalize_first(key),
                        content=capitalize_first(value),
                        category=type,
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)
                    self.card_counter += 1
            except KeyError as e:
                processing_logger.error(f"KeyError in create_default, item {item} {e}")

    def create_mcq(self, content: list) -> None:
        for item in content:
            try:
                key = item["A"]
                if not self.check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=capitalize_first(key),
                        content=capitalize_first(value.get("content")),
                        category="Mcq",
                        boc_2=capitalize_first(value.get("boc_2")),
                        boc_3=capitalize_first(value.get("boc_3")),
                        boc_4=capitalize_first(value.get("boc_4")),
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)
                    self.card_counter += 1
            except KeyError:
                processing_logger.error(f"KeyError in create_mcq, item {item}")

    def create_formulas(self, content: list) -> None:
        for item in content:
            try:
                key = capitalize_first(item["A"])
                if not self.check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=key,
                        content=capitalize_first(value.get("content")),
                        category="Formulas",
                        formula=value.get("formula"),
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)
                    self.card_counter += 1
            except KeyError:
                processing_logger.error(f"KeyError in create_formulas, item {item}")

    def create_discuss(self, content: list) -> None:
        for item in content:
            try:
                key = capitalize_first(item["A"])
                if not self.check_card_exist(key):
                    value = item["B"]

                    card = Card(
                        term=key,
                        content=capitalize_first(value.get("content")),
                        category="Discuss",
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)
                    self.card_counter += 1
            except KeyError:
                processing_logger.error(f"KeyError in create_discuss, item {item}")

    def check_card_exist(self, term: str) -> bool:
        term = term.lower()
        singular_term = to_singular(term)
        for card in self.deck.cards:
            card_term = card.term.lower()
            singular_card_term = to_singular(card_term)
            if term == card_term or singular_term == singular_card_term:
                return True
        return False

    async def async_create_default(self, content: list, category: str) -> None:
        for item in content:
            try:
                key = item["A"]
                if not await self.async_check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=capitalize_first(key),
                        content=capitalize_first(value),
                        category=category,
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)

                    self.card_counter += 1
            except KeyError:
                processing_logger.error(
                    f"KeyError in async_create_default, item {item}"
                )
        await self.session.commit()

    async def async_create_mcq(self, content_list: list) -> None:
        for item in content_list:
            try:
                question = capitalize_first(item["A"])
                if not await self.async_check_card_exist(question):
                    content = capitalize_first(item["B"])
                    boc_2 = capitalize_first(item["C"])
                    boc_3 = capitalize_first(item["D"])
                    boc_4 = capitalize_first(item["E"])
                    card = Card(
                        term=question,
                        content=content,
                        category="Mcq",
                        boc_2=boc_2,
                        boc_3=boc_3,
                        boc_4=boc_4,
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)
                    self.card_counter += 1
            except KeyError:
                processing_logger.error(f"KeyError in async_create_mcq, item {item}")
        await self.session.commit()

    async def async_create_formulas(self, content: list) -> None:
        for item in content:
            try:
                key = capitalize_first(item["A"])
                if not await self.async_check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=key,
                        content=capitalize_first(value.get("content")),
                        category="Formulas",
                        formula=value.get("formula"),
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)

                    self.card_counter += 1
            except KeyError:
                processing_logger.error(
                    f"KeyError in async_create_formulas, item {item}"
                )
        await self.session.commit()

    async def async_create_discuss(self, content: list) -> None:
        for item in content:
            try:
                key = item["A"]
                if not await self.async_check_card_exist(key):
                    value = item["B"]
                    card = Card(
                        term=capitalize_first(key),
                        content=capitalize_first(value.get("content")),
                        category="Discuss",
                    )
                    self.deck.cards.append(card)
                    self.session.add(card)

                self.card_counter += 1
            except KeyError:
                processing_logger.error(
                    f"KeyError in async_create_discuss, item {item}"
                )
        await self.session.commit()

    async def async_check_card_exist(self, term: str) -> bool:
        # Explicitly query for the deck with the related cards

        term = term.lower()
        singular_term = to_singular(term)
        for card in self.deck.cards:
            card_term = card.term.lower()
            singular_card_term = to_singular(card_term)
            if term == card_term or singular_term == singular_card_term:
                return True
        return False

    @staticmethod
    def process_new_card_data(card_data, response):
        if isinstance(response, list):
            response = response[0]
        if card_data.category == "Mcq":
            card_data = CardFactory.process_mcq(card_data, response)
        else:
            card_data = CardFactory.process_standard_card(card_data, response)
        return card_data

    @staticmethod
    def process_mcq(card_data, response):
        card_data.content = capitalize_first(response["A"])
        card_data.boc_2 = capitalize_first(response["B"])
        card_data.boc_3 = capitalize_first(response["C"])
        card_data.boc_4 = capitalize_first(response["D"])
        return card_data

    @staticmethod
    def process_standard_card(card_data, response):
        card_data.content = capitalize_first(response["B"])
        return card_data


def to_singular(word: str) -> str:
    if word.endswith("ies"):
        return f"{word[:-3]}y"
    elif word.endswith("es"):
        return word[:-2]
    elif word.endswith("s"):
        return word[:-1]
    return word


## Capitalizes the first letter of a string
def capitalize_first(s: str) -> str:
    if not s:
        return s
    return s[0].upper() + s[1:]
