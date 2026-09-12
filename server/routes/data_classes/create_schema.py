from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DetailField(str, Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"


class CardType(str, Enum):
    Mcq = "Mcq"
    Cloze = "Cloze"
    Definitions = "Definitions"
    Mix = "Mix"
    Translate = "Translate"
    Rhyme = "Rhyme"
    People = "People"
    Comprehension = "Comprehension"
    Vocab_builder = "Vocab builder"
    Formulas = "Formulas"
    Custom = "Custom"
    Explain = "Explain"
    Discuss = "Discuss"
    Jeopardy = "Jeopardy"


class Language(str, Enum):
    English = "English"
    French = "French"
    Spanish = "Spanish"
    German = "German"
    Portuguese = "Portuguese"
    Chinese = "Chinese"
    Russian = "Russian"
    Ukrainian = "Ukrainian"
    Swahili = "Swahili"
    Japanese = "Japanese"
    Dothraki = "Dothraki"
    Klingon = "Klingon"
    Dutch = "Dutch"
    Italian = "Italian"
    Greek = "Greek"
    Arabic = "Arabic"
    Hindi = "Hindi"
    Polish = "Polish"
    Hebrew = "Hebrew"
    Finnish = "Finnish"
    Norwegian = "Norwegian"
    Swedish = "Swedish"
    Turkish = "Turkish"
    Czech = "Czech"
    Romanian = "Romanian"
    Hungarian = "Hungarian"
    Bulgarian = "Bulgarian"
    Croatian = "Croatian"
    Serbian = "Serbian"
    Estonian = "Estonian"
    Latvian = "Latvian"
    Lithuanian = "Lithuanian"
    Farsi = "Farsi"
    Korean = "Korean"
    Indonesian = "Indonesian"
    Vietnamese = "Vietnamese"
    Urdu = "Urdu"
    Persian = "Persian"
    Thai = "Thai"
    Malay = "Malay"
    Tagalog = "Tagalog"


class Subject(str, Enum):
    Unspecified = "Unspecified"
    Anthropology = "Anthropology"
    Art = "Art"
    Astronomy = "Astronomy"
    Biology = "Biology"
    Literature = "Literature"
    Medecine = "Medecine"
    Business_Studies = "Business Studies"
    Chemistry = "Chemistry"
    Classical_Studies = "Classical Studies"
    Computer_Science = "Computer Science"
    Creative_Writing = "Creative Writing"
    Culinary_Arts = "Culinary Arts"
    Dance = "Dance"
    Design = "Design"
    Economics = "Economics"
    English = "English"
    Environmental_Science = "Environmental Science"
    Film_Studies = "Film Studies"
    Forensic_Science = "Forensic Science"
    Geography = "Geography"
    Health_Education = "Health Education"
    History = "History"
    Journalism = "Journalism"
    Legal_Studies = "Legal Studies"
    Linguistics = "Linguistics"
    Marine_Science = "Marine Science"
    Math = "Math"
    Modern_Languages = "Modern Languages"
    Music = "Music"
    Philosophy = "Philosophy"
    Physical_Education = "Physical Education"
    Physics = "Physics"
    Political_Science = "Political Science"
    Psychology = "Psychology"
    Robotics = "Robotics"
    Science = "Science"
    Social_Studies = "Social Studies"
    Sociology = "Sociology"
    Technology_and_Design = "Technology and Design"
    Theatre_Studies = "Theatre Studies"
    Veterinary_Science = "Veterinary Science"
    World_Religions = "World Religions"


class ExtrasOptions(str, Enum):
    Generate_Images = "Generate images"
    Save_Text = "Save text"
    Create_Summary = "Create summary"
    Create_Notes = "Create notes"


class ExtractionRequestData(BaseModel):
    cardTypeField: Optional[CardType] = None
    subjectField: Optional[Subject] = None
    languageField: Optional[Language] = Language.English
    detailField: Optional[DetailField] = None
    translationField: Optional[Language] = None
    minField: Optional[str] = None
    maxField: Optional[str] = None
    multiOptionsField: Optional[list[ExtrasOptions]] = None
    customTermField: Optional[str] = None
    customContentField: Optional[str] = None
    nameField: Optional[str] = None
    descriptionField: Optional[str] = None
    existingDeckField: Optional[int] = None
    textField: Optional[str] = Field(
        None,
        description="Text to be extracted, if this is provided the link field is ignored",
    )
    linkField: Optional[str] = None
    expandedLinkField: Optional[bool] = False

    # @field_validator(
    #     "languageField",
    #     "detailField",
    #     "multiOptionsField",
    #     "translationField",
    #     "subjectField",
    #     "textField",
    #     "linkField",
    #     "descriptionField",
    # )
    # def empty_str_to_none(self, value: str) -> str | None:
    #     return None if value == "" else value
