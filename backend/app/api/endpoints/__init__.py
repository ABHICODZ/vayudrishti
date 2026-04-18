from fastapi import APIRouter
from . import dashboard, gee, users, admin_complaints, admin_tasks, admin_alerts, admin_analytics, admin_agents, admin_council, policy_simulator

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(gee.router, prefix="/gee", tags=["earth-engine"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
# Citizen-scoped routes: /user/complaints (no admin required)
api_router.include_router(users.router, prefix="/user", tags=["citizen"])
api_router.include_router(admin_complaints.router, prefix="/admin/complaints", tags=["admin-complaints"])
api_router.include_router(admin_tasks.router, prefix="/admin/tasks", tags=["admin-tasks"])
api_router.include_router(admin_alerts.router, prefix="/admin/alerts", tags=["admin-alerts"])
api_router.include_router(admin_analytics.router, prefix="/admin/analytics", tags=["admin-analytics"])
api_router.include_router(admin_agents.router, prefix="/admin/agents", tags=["admin-agents"])
api_router.include_router(admin_council.router, prefix="/admin/council", tags=["admin-council"])
api_router.include_router(policy_simulator.router, prefix="/admin/policy", tags=["policy-simulator"])
