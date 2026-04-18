import os
import httpx
import time
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_db
from app.db.admin_models import Complaint, Profile
from app.schemas.admin_schemas import ComplaintResponse
from app.api.deps import get_current_user, oauth2_scheme

router = APIRouter()

def get_supabase_config():
    """Get Supabase configuration from environment variables"""
    url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")
    return url, key


@router.get("/complaints", response_model=List[ComplaintResponse])
async def get_my_complaints(
    current_user: Profile = Depends(get_current_user),
    token: str = Depends(oauth2_scheme)
):
    """
    Returns complaints filed by the currently authenticated user.
    Scoped strictly to citizen_id == current_user.id.
    Uses Supabase REST API to bypass direct database connection issues.
    """
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=503, detail="Supabase configuration missing")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}"  # Use user's JWT token for RLS
    }
    
    start = time.time()
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{SUPABASE_URL}/rest/v1/complaints?citizen_id=eq.{current_user.id}&order=created_at.desc&select=*"
        try:
            resp = await client.get(url, headers=headers)
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    
    elapsed = int((time.time() - start) * 1000)
    print(f"[users] GET /user/complaints → user={current_user.id} elapsed={elapsed}ms")
    
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Failed to fetch complaints: {resp.text}")
    
    return resp.json()


@router.get("/{username}/exposure")
async def get_safe_exposure(username: str, current_aqi: int):
    """
    Hackathon Win Algorithm: Calculates highly personalized safe 
    outdoor exposure time using Cloud Supabase Profiles.
    """
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY or "placeholder" in SUPABASE_URL:
        raise HTTPException(
            status_code=503, 
            detail="MISSING_CREDENTIALS: You must populate SUPABASE_URL and SUPABASE_KEY to resolve the cloud profile."
        )

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{SUPABASE_URL}/rest/v1/profiles?username=eq.{username}&select=*"
        try:
            resp = await client.get(url, headers=headers)
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Cloud Connection Terminated: {str(e)}")
            
    if resp.status_code != 200:
        raise HTTPException(status_code=503, detail="Supabase linkage rejected the REST request.")
        
    data = resp.json()
    if not data:
        raise HTTPException(status_code=404, detail="Civilian profile not found in the Supabase cluster. Please register first.")
        
    user = data[0]
    
    age = user.get("age", 30)
    asthma = user.get("has_asthma", False)
    
    safe_minutes = 1440
    
    if current_aqi > 50:
        safe_minutes = 1440 * (50 / current_aqi)
    
    if asthma:
        safe_minutes *= 0.4
    if age > 65 or age < 12:
        safe_minutes *= 0.5
        
    safe_minutes = max(10, min(1440, int(safe_minutes)))
    
    risk_level = "Low"
    if current_aqi > 150 or safe_minutes < 120: risk_level = "High"
    if current_aqi > 300 or safe_minutes < 30: risk_level = "CRITICAL"
    
    vuln_string = []
    if asthma: vuln_string.append("asthma")
    if age > 65: vuln_string.append("senior age bracket")
    elif age < 12: vuln_string.append("pediatric age bracket")
    
    reasoning = f"due to {', '.join(vuln_string)}" if vuln_string else "based on healthy adult baselines"
    
    return {
        "username": username,
        "current_aqi": current_aqi,
        "safe_exposure_minutes": safe_minutes,
        "risk_level": risk_level,
        "recommendation": f"Warning: Your personalized safe exposure is limited to {safe_minutes} mins {reasoning}."
    }
