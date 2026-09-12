import asyncio

from sqlalchemy.future import select

from dependencies.settings import get_settings
from models.models_ import (
    User,
)
from models.user.user_manager import UserManager
from startup.setup_db import async_session

settings = get_settings()
# engine = create_engine(SQLALCHEMY_DATABASE_URI, **SQLALCHEMY_ENGINE_OPTIONS)


async def update_db() -> None:
    async with async_session() as db:
        ## get all users
        # users = await db.execute(select(User))
        # users = users.scalars().all()

        # for user in users:
        #     user_count += 1
        #     print(user.email)

        user = await db.execute(
            select(User).where(User.email == "kevin.e.mccarthy1983@gmail.com"),
        )
        user = user.scalars().first()
        await UserManager.update_quantity_cards_data(db, user)
        # await UserManager.update_quantity_quizzes(db, user)
        # await UserManager.update_quantity_groups(db, user)
        # await UserManager.update_quantity_files(db, user)
        # await UserManager.async_remaining_credit(db, user, settings.token)
        # await UserManager.update_quantity_decks_public(db, user)
        await db.commit()


loop = asyncio.get_event_loop()

# Use the event loop to run the update_db function
loop.run_until_complete(update_db())
