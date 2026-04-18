import enum
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Dialect
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class ComplaintStatus(str, enum.Enum):
    NEW = 'NEW'
    UNDER_REVIEW = 'UNDER_REVIEW'
    IN_ACTION = 'IN_ACTION'
    RESOLVED = 'RESOLVED'
    REJECTED = 'REJECTED'

class TaskPriority(str, enum.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'

class TaskStatus(str, enum.Enum):
    PENDING = 'PENDING'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'

class AlertSeverity(str, enum.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'

class AlertTrigger(str, enum.Enum):
    AQI_SPIKE = 'AQI_SPIKE'
    REPEATED_COMPLAINTS = 'REPEATED_COMPLAINTS'
    HOTSPOT = 'HOTSPOT'

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(UUID(as_uuid=True), primary_key=True)
    username = Column(String, unique=True)
    role = Column(String, default='citizen')
    home_ward = Column(String)

class Complaint(Base):
    __tablename__ = 'complaints'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id'), nullable=False)
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    ward = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    media_url = Column(String)
    status = Column(ENUM(ComplaintStatus), default=ComplaintStatus.NEW, nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey('profiles.id'))
    internal_notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    complaint_id = Column(UUID(as_uuid=True), ForeignKey('complaints.id'))
    assignee_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id'))
    title = Column(String, nullable=False)
    description = Column(String)
    priority = Column(ENUM(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    status = Column(ENUM(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    deadline = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class Alert(Base):
    __tablename__ = 'alerts'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward = Column(String, nullable=False)
    trigger_type = Column(ENUM(AlertTrigger), nullable=False)
    severity = Column(ENUM(AlertSeverity), default=AlertSeverity.HIGH, nullable=False)
    is_acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = 'audit_logs'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id'))
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    old_data = Column(JSONB)
    new_data = Column(JSONB)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
