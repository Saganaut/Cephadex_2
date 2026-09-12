class MyBaseError(Exception):
    """Base class for all custom exceptions."""

    def __init__(self, message: str = "An error has occurred."):
        self.message: str = message
        super().__init__(self.message)

    def __str__(self) -> str:
        return self.message


class YoutubeError(MyBaseError):
    """Exception raised when unable to retrieve video transcript from YouTube."""

    def __init__(self, message: str = "Unable to retrieve video transcript from YouTube."):
        super().__init__(message)


class UnsupportedFileError(MyBaseError):
    """Exception raised when an unsupported file type is uploaded."""

    def __init__(self, message: str = "Unsupported file type."):
        super().__init__(message)


class AudioError(MyBaseError):
    """Exception raised when an unsupported file type is uploaded."""

    def __init__(self, message: str = "Audio error."):
        super().__init__(message)


class ExtractionError(MyBaseError):
    """Exception raised when unable to extract text from input file"""

    def __init__(self, message: str = "Extraction error."):
        super().__init__(message)


class ExtractionWikiError(MyBaseError):
    """Exception raised when unable to extract text from wikipedia"""

    def __init__(self, message: str = "Extraction error from wikipedia."):
        super().__init__(message)


class ProcessingJobError(MyBaseError):
    """Exception raised when a job fails to process."""

    def __init__(self, message: str = "Processing job error."):
        super().__init__(message)


class ProcessingCompletionError(MyBaseError):
    """Exception raised when a job fails to process."""

    def __init__(self, message: str = "Processing completion error."):
        super().__init__(message)


class APIResponseError(MyBaseError):
    """Exception raised when a job fails to process."""

    def __init__(self, message: str = "No content error."):
        super().__init__(message)


class APIResponseFormatError(MyBaseError):
    """Exception raised when a job fails to process."""

    def __init__(self, message: str = "API response format error."):
        super().__init__(message)
