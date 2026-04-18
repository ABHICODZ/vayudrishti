from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.db.database import get_db
from app.db.admin_models import Alert, Profile
from app.schemas.admin_schemas import AlertCreate, AlertUpdate, AlertResponse
from app.api.deps import require_admin

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
async def list_alerts(
    is_acknowledged: Optional[bool] = None,
    severity: Optional[str] = None,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(Alert)
    if is_acknowledged is not None:
        query = query.where(Alert.is_acknowledged == is_acknowledged)
    if severity:
        query = query.where(Alert.severity == severity)
        
    query = query.order_by(Alert.is_acknowledged.asc(), Alert.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=AlertResponse)
async def create_alert(
    alert: AlertCreate,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    # Depending on architecture, alerts might be created by internal system scripts without token
    # But if manually forced, we keep it under require_admin
    new_alert = Alert(**alert.model_dump())
    db.add(new_alert)
    await db.commit()
    await db.refresh(new_alert)
    return new_alert

@router.patch("/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(
    alert_id: UUID,
    alert_update: AlertUpdate,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalars().first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.is_acknowledged = alert_update.is_acknowledged

    await db.commit()
    await db.refresh(alert)
    return alert
