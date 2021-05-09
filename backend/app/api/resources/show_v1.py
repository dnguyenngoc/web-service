from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from settings import config
from fastapi import HTTPException
from fastapi import Form

from databases.db import get_db
from databases.repository_logic import document_process_logic, document_logic, document_type_logic, status_logic

router = APIRouter()

@router.get('/document/{type_doc}/{status_code}/last')
def split_last(
    *,
    type_doc: str,
    status_code: int, 
    skip: int,
    db_session: Session = Depends(get_db)
):
    doc_type = document_type_logic.read_by_nane(db_session, type_doc)
    if not doc_type: raise HTTPException(status_code=400, detail="bad request")
    status = status_logic.read_by_status_code(db_session, status_code)
    if not status: raise HTTPException(status_code=400, detail="bad request")
    if type_doc == 'identity-card' and status_code == 200:
        last_doc = document_logic.get_one_last_type_status(db_session, doc_type.id, status.id, skip)
        if last_doc is None: raise HTTPException(status_code=404, detail="not found")
        fields = [{"name": item.name, "value": item.url} for item in last_doc.document_process]
        obj = {
            'id': last_doc.id, 
            'origin': {"name": "origin", "value": last_doc.url},
            'crop': {'name': 'crop', 'value': last_doc.crop_url},
            'fields': fields
        }
        return obj
   