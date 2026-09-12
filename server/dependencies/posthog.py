from typing import Annotated

from fastapi import Depends, Request
from posthog import Posthog


def get_post_hog(request: Request) -> Posthog:
    return request.app.state.posthog


GetPostHog = Annotated[Posthog, Depends(get_post_hog)]
