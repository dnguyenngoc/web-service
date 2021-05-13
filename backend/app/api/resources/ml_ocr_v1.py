from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from settings import config

from fastapi import HTTPException
from fastapi import Form

from databases.db import get_db

from databases.repository_logic import document_logic, document_type_logic, status_logic, document_process_logic
from databases.repository_crud import document_crud, document_process_crud

from helpers import time_utils


router = APIRouter()


@router.get('/not-process')
def get_all_docs_status(
    *,
    limit: int,
    db_session: Session = Depends(get_db),
):
    data = document_process_logic.get_not_ocr_limit(db_session, False, limit)
    if not data: raise HTTPException(status_code=404, detail="not found")
    return data

@router.put('/complete-process')
def update_complete(
    *,
    db_session: Session = Depends(get_db),
    id: int = Form(...),
    document_id: int = Form(...),
    value: str = Form(None),
):
    data = document_process_crud.update(db_session, id, {'value': value, 'is_extracted': True, 'update_date': time_utils.utc_now()})
    return data

@router.put('/doc-export')
def update_bad_document(
    *,
    document_id: int = Form(...),
    status_code: int = Form(...),
    db_session: Session = Depends(get_db),
   
):
    status = status_logic.read_by_status_code(db_session, status_code)
    if not status: raise HTTPException(status_code=400, detail="bad request")
    docs = document_crud.update(db_session, document_id, {'status_id': status.id, 'update_date': time_utils.utc_now(), 'export_data': time_utils.utc_now()}) 
    return docs


@router.put('/{status_name}')
def update_bad_document(
    *,
    status_name: str,
    document_id: int = Form(...),
    type_doc: str = Form(...),
    status_code: int = Form(...),
    db_session: Session = Depends(get_db),
   
):
    if status_name not in config.LIST_STATUS_NAME: raise HTTPException(status_code=400, detail="bad request")
    
    doc_type = document_type_logic.read_by_nane(db_session, type_doc)
    if not doc_type: raise HTTPException(status_code=400, detail="bad request")
    
    status = status_logic.read_by_status_code(db_session, status_code)
    if not status: raise HTTPException(status_code=400, detail="bad request")
    
    doc = document_logic.get_by_id_join_type_join_status(db_session, document_id)
    if not doc: raise HTTPException(status_code=404, detail="not found")
    docs = document_crud.update(db_session, document_id, {'status_id': status.id, 'update_date': time_utils.utc_now()}) 
    if docs != 1: raise HTTPException(status_code=400, detail="wrong document id")
    return docs
    
    
   