from models.exceptions.exceptions import MyBaseError


class JobProcessingExceptions:
    class FindingPendingJobsError(MyBaseError):
        def __init__(self, message: str = "Unknown error in find_pending_jobs."):
            super().__init__(f"{message}")

    class ErrorReassemblingLongFormJobError(MyBaseError):
        def __init__(self, message: str = "Error reassembling long form job."):
            super().__init__(f"{message}")

    class DocCreatorNotInitializedError(MyBaseError):
        def __init__(self, message: str = "Doc creator not initialized."):
            super().__init__(f"{message}")

    class UnableToCreateDeckAttributesError(MyBaseError):
        def __init__(self, message: str = "Unable to create deck attributes."):
            super().__init__(f"{message}")
