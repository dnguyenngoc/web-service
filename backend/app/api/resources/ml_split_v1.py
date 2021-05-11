from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from settings import config

from fastapi import HTTPException

from databases.db import get_db

from databases.repository_logic import document_logic, document_type_logic, status_logic


router = APIRouter()

@router.get('/ml_split/{type_doc}/{status_code}')
def get_all_docs_status(
    *,
    type_doc: str,
    status_code: int, 
    db_session: Session = Depends(get_db),
):
    doc_type = document_type_logic.read_by_nane(db_session, type_doc)
    if not doc_type: raise HTTPException(status_code=400, detail="bad request")
    
    status = status_logic.read_by_status_code(db_session, status_code)
    if not status: raise HTTPException(status_code=400, detail="bad request")
        
    docs = document_logic.get_all_type_and_status(db_session, doc_type.id, status.id) 
    if not docs: raise HTTPException(status_code=404, detail="Not found")
    return docs
    
    
   