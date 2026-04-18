import asyncio
from app.db.database import SessionLocal
from app.db.admin_models import Profile
from sqlalchemy import select

async def test_db():
    async with SessionLocal() as session:
        try:
            result = await session.execute(select(Profile).limit(1))
            profiles = result.scalars().all()
            print(f"✅ Database connected! Found {len(profiles)} profiles")
            if profiles:
                print(f"   First profile: {profiles[0].username}")
        except Exception as e:
            print(f"❌ Database error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db())
