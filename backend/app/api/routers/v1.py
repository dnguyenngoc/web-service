from fastapi import APIRouter

from api.resources import workflow_v1, ftp_v1, show_v1, ml_split_v1


router = APIRouter()

router.include_router(workflow_v1.router, prefix="/workflow", tags=["V1 Workflow"])
router.include_router(ftp_v1.router, prefix="/ftp", tags=["V1 Ftp"])
router.include_router(show_v1.router, prefix="/show", tags=["V1 Show"])
router.include_router(ml_split_v1.router, prefix="/show", tags=["V1 ML Split"])