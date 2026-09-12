import asyncio
import logging

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)
from websockets import ConnectionClosedOK

deck_notifications_router = APIRouter()

logger = logging.getLogger("App")


@deck_notifications_router.websocket("/notifications/{slug}")
async def notifications_websocket(slug, websocket: WebSocket):
    logger.debug("Entered notification websocket for slug: %s", slug)
    try:
        await websocket.accept()
        r_client = websocket.app.state.redis_client
        redis_subscriber = r_client.pubsub()
        await redis_subscriber.subscribe(slug)
    except Exception as e:
        logger.error(
            "Unhandled exception in Deck Notifications Websocket while subscribing to redis channel",
            e,
        )
        await websocket.close()
        return
    try:
        while True:
            message = await redis_subscriber.get_message()
            if message is not None:
                await websocket.send_json(message["data"])
            await asyncio.sleep(1)
    except WebSocketDisconnect as e:
        if e.code == 1000:
            logger.info("Deck Notifications Websocket Connection Closed normally")
        else:
            logger.error(
                "Deck Notifications Websocket Connection Closed unexpectedly",
                exc_info=True,
            )
    except KeyboardInterrupt as e:
        logger.error("Deck Notifications keyboard interrupt", e)
        await websocket.close()
    except ConnectionClosedOK as e:
        logger.info("Deck Notifications Websocket Connection Closed OK", e)
    except Exception as e:
        logger.error("Unhandled exception in Deck Notifications Websocket", e)
    finally:
        if redis_subscriber:
            await redis_subscriber.unsubscribe(slug)
        if r_client:
            await r_client.close()
