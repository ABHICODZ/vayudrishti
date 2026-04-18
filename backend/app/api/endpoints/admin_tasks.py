from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.db.database import get_db
from app.db.admin_models import Task, Profile
from app.schemas.admin_schemas import TaskCreate, TaskUpdate, TaskResponse
from app.api.deps import require_admin

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status: Optional[str] = None,
    assignee_id: Optional[UUID] = None,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(Task)
    if status:
        query = query.where(Task.status == status)
    
    # If the user is an admin they can see all. If they are just an officer, they ONLY see their own.
    if current_user.role == 'officer':
        query = query.where(Task.assignee_id == current_user.id)
    elif assignee_id:
        query = query.where(Task.assignee_id == assignee_id)
        
    query = query.order_by(Task.deadline.asc().nulls_last(), Task.priority.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    # Only admins can create tasks for others, officers can only create tasks for themselves
    if task.assignee_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Officers can only create self-assigned tasks")
        
    new_task = Task(**task.model_dump())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

@router.patch("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(
    task_id: UUID,
    task_update: TaskUpdate,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalars().first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Ensure officer can only update their own task unless admin
    if task.assignee_id != current_user.id and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Cannot update another officer's task")

    if task_update.status:
        task.status = task_update.status
        if task_update.status == 'COMPLETED':
            task.completed_at = datetime.utcnow()
            
    if task_update.priority and current_user.role == 'admin':
        task.priority = task_update.priority

    await db.commit()
    await db.refresh(task)
    return task
