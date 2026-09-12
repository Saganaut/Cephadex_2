from models.exceptions.exceptions import MyBaseError


class CreatorExceptions:
    class InvalidPromptOptionError(MyBaseError):
        def __init__(self, prompt_option: str, message: str = "Invalid Prompt Option."):
            self.prompt_option = prompt_option
            super().__init__(f"{message} : {self.prompt_option}")

    class MissingPromptOptionError(MyBaseError):
        def __init__(self, message: str = "No Prompt Option Supplied."):
            super().__init__(f"{message}")
