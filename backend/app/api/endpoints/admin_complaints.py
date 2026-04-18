import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.db.database import get_db
from app.db.admin_models import Complaint, Profile
from app.schemas.admin_schemas import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from app.api.deps import require_admin, get_current_user, oauth2_scheme

router = APIRouter()

def get_supabase_config():
    """Get Supabase configuration from environment variables"""
    url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")
    return url, key

@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(
    status: Optional[str] = None,
    ward: Optional[str] = None,
    current_user: Profile = Depends(require_admin),
    token: str = Depends(oauth2_scheme)
):
    """List all complaints using Supabase REST API"""
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=503, detail="Supabase configuration missing")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}"  # Use user's JWT token for RLS
    }
    
    # Build query parameters
    url = f"{SUPABASE_URL}/rest/v1/complaints?order=created_at.desc&select=*"
    if status:
        url += f"&status=eq.{status}"
    if ward:
        url += f"&ward=eq.{ward}"
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.get(url, headers=headers)
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Failed to fetch complaints: {resp.text}")
    
    return resp.json()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: Profile = Depends(get_current_user),
    token: str = Depends(oauth2_scheme)
):
    """Create a complaint using Supabase REST API"""
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    print(f"[COMPLAINTS] POST / called by user {current_user.id}")
    print(f"[COMPLAINTS] SUPABASE_URL: {SUPABASE_URL[:30]}..." if SUPABASE_URL else "[COMPLAINTS] SUPABASE_URL: None")
    print(f"[COMPLAINTS] Using user JWT token for RLS")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[COMPLAINTS] ERROR: Supabase configuration missing!")
        raise HTTPException(status_code=503, detail="Supabase configuration missing")
    
    # Ensure they can only file under their own ID or they are an admin filing for someone else
    if complaint.citizen_id != current_user.id and current_user.role not in ['admin', 'officer']:
        raise HTTPException(status_code=403, detail="Cannot file complaint for another user")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",  # Use user's JWT token for RLS
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Convert complaint data to dict and ensure all UUIDs are strings for JSON serialization
    complaint_data = {}
    for key, value in complaint.model_dump().items():
        if isinstance(value, UUID):
            complaint_data[key] = str(value)
        else:
            complaint_data[key] = value
    
    print(f"[COMPLAINTS] Submitting complaint: ward={complaint_data.get('ward')}, category={complaint_data.get('category')}")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.post(
                f"{SUPABASE_URL}/rest/v1/complaints",
                headers=headers,
                json=complaint_data
            )
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    
    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=resp.status_code, detail=f"Failed to create complaint: {resp.text}")
    
    return resp.json()[0] if isinstance(resp.json(), list) else resp.json()

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: UUID,
    complaint_update: ComplaintUpdate,
    current_user: Profile = Depends(require_admin),
    token: str = Depends(oauth2_scheme)
):
    """Update complaint status using Supabase REST API"""
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=503, detail="Supabase configuration missing")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",  # Use user's JWT token for RLS
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Build update payload
    update_data = {}
    if complaint_update.status:
        update_data["status"] = complaint_update.status
        if complaint_update.status in ['RESOLVED', 'REJECTED']:
            update_data["resolved_at"] = datetime.utcnow().isoformat()
    
    if complaint_update.assigned_to:
        update_data["assigned_to"] = str(complaint_update.assigned_to)
    
    if complaint_update.internal_notes:
        update_data["internal_notes"] = complaint_update.internal_notes
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.patch(
                f"{SUPABASE_URL}/rest/v1/complaints?id=eq.{complaint_id}",
                headers=headers,
                json=update_data
            )
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Failed to update complaint: {resp.text}")
    
    result = resp.json()
    if not result:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    return result[0] if isinstance(result, list) else result
