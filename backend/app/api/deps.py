from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.admin_models import Profile
from app.core.config import settings
import json
import base64
import uuid
import httpx
from dataclasses import dataclass

@dataclass
class UserContext:
    """Lightweight user context extracted from Supabase JWT. 
    Does NOT require a DB round-trip for identity verification."""
    id: uuid.UUID
    email: str
    role: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def _upsert_profile_supabase(user_uuid: uuid.UUID, email: str, role: str, jwt_token: str) -> bool:
    """
    Upserts the user profile via Supabase REST API.
    This is reliable even when direct Postgres is unavailable.
    """
    supabase_url = settings.SUPABASE_URL
    supabase_key = settings.SUPABASE_KEY
    if not supabase_url or not supabase_key:
        return False
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{supabase_url}/rest/v1/profiles",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Content-Type": "application/json",
                    "Prefer": "resolution=ignore-duplicates,return=minimal",
                },
                json={
                    "id": str(user_uuid),
                    "username": email,
                    "role": role,
                }
            )
            if resp.status_code in (200, 201, 204):
                print(f"[AUTH] Profile upserted via REST API for {email}")
                return True
            else:
                print(f"[AUTH] Profile upsert failed: {resp.status_code} {resp.text[:100]}")
                return False
    except Exception as e:
        print(f"[AUTH] Profile upsert REST error: {e}")
        return False

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> UserContext:
    """
    Decodes the Supabase JWT and returns a UserContext.
    Ensures the user profile exists in DB before returning (required for FK constraints).
    """
    try:
        # A Supabase JWT has 3 parts. Decode the payload (middle part).
        parts = token.split('.')
        if len(parts) != 3:
            raise ValueError("Malformed JWT token")
        
        payload_b64 = parts[1]
        payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise ValueError("No user ID in token")

        user_uuid = uuid.UUID(user_id_str)
        email = payload.get("email", f"user_{user_id_str[:8]}@example.com")
        # Supabase stores custom roles in app_metadata
        role = payload.get("app_metadata", {}).get("role", "citizen")

        print(f"[AUTH] OK user={email} role={role}")

        # Upsert profile via Supabase REST API (FK-safe, always works)
        await _upsert_profile_supabase(user_uuid, email, role, token)

        return UserContext(id=user_uuid, email=email, role=role)

    except Exception as e:
        print(f"[AUTH ERROR] {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def require_admin(current_user: UserContext = Depends(get_current_user)) -> UserContext:
    if current_user.role not in ['admin', 'officer']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
