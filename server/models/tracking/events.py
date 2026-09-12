from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from models.tracking.event_tracking import EventTracking


class Event_Tracker:
    @staticmethod
    def non_async_add_event(
        db: Session, event_type: str, event_data: str, event_details: str
    ):
        event = EventTracking(
            event_type=event_type, event_data=event_data, event_details=event_details
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    async def add_event(
        db: AsyncSession, event_type: str, event_data: str, event_details: str
    ):
        event = EventTracking(
            event_type=event_type, event_data=event_data, event_details=event_details
        )
        db.add(event)
        await db.commit()
        await db.refresh(event)
        return event
