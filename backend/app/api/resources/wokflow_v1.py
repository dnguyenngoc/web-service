from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from databases.db import get_db
from api.entities import workflow_v1_entity 

router = APIRouter()

@router.post("/count", response_model=workflow_v1_entity.CountResponse)
def count(
    db: Session = Depends(get_db), 
):
    return 'here'
