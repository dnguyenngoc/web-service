from fastapi import APIRouter

from api.resources import workflow_v1

router = APIRouter()


router.include_router(workflow_v1.router, prefix="/worflow-v1")
