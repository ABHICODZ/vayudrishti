from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Complaints
class ComplaintBase(BaseModel):
    citizen_id: UUID
    location_lat: float
    location_lon: float
    ward: str
    category: str
    description: str
    media_url: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[UUID] = None
    internal_notes: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: UUID
    status: str
    assigned_to: Optional[UUID] = None
    internal_notes: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Tasks
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = 'MEDIUM'
    deadline: Optional[datetime] = None

class TaskCreate(TaskBase):
    complaint_id: Optional[UUID] = None
    assignee_id: Optional[UUID] = None

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None

class TaskResponse(TaskBase):
    id: UUID
    complaint_id: Optional[UUID] = None
    assignee_id: Optional[UUID] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Alerts
class AlertBase(BaseModel):
    ward: str
    trigger_type: str
    severity: str = 'HIGH'

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    is_acknowledged: bool

class AlertResponse(AlertBase):
    id: UUID
    is_acknowledged: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Audit Logs
class AuditLogResponse(BaseModel):
    id: UUID
    actor_id: Optional[UUID] = None
    action: str
    entity_type: str
    entity_id: UUID
    old_data: Optional[dict] = None
    new_data: Optional[dict] = None
    timestamp: datetime

    class Config:
        from_attributes = True
