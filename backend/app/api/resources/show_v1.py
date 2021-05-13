from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from settings import config
from fastapi import HTTPException
from fastapi import Form

from databases.db import get_db
from databases.repository_logic import document_process_logic, document_logic, document_type_logic, status_logic
from databases.repository_crud import document_process_crud

router = APIRouter()


@router.post('/document/{type_doc}/{status_code}/last')
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
    elif type_doc == 'discharge-record' and status_code == 200:
        return    {
            'id': 1,
            'origin': {'name': 'origin', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_origin.png'.format(port = config.BE_PORT, host = config.BE_HOST)}, 
            'crop': {'name': 'crop', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_crop.png'.format(port = config.BE_PORT, host = config.BE_HOST)}, 
            'fields': [
                 {'name': 'Patient Name', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_name.png'.format(port = config.BE_PORT, host = config.BE_HOST)}, 
                 {'name': 'Age Or DOB', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_age.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Gender', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_gender.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Nation', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_nation.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Insurance Number', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_id.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Address', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_address.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Event Start Date', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_come.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Event End Date', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_out.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Diagnosis Description', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_diag.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Treatment Description', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_solu.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
                 {'name': 'Note', 'value': 'http://{host}:{port}/api/v1/ftp/image/discharge-record/import/fake/1_note.png'.format(port = config.BE_PORT, host = config.BE_HOST)},
            ]
        }
   

@router.post('/ocr/last')
def ocr_last(
    *,
    db_session: Session = Depends(get_db),
    type_doc: str = Form(...),
    status_code: str = Form(...),
    skip: int = Form(None),
):
    if skip == None:
        skip = 0
        
    status = status_logic.read_by_status_code(db_session, status_code)
    if not status: raise HTTPException(status_code=400, detail="bad request")
        
    doc_type = document_type_logic.read_by_nane(db_session, type_doc)
    if not doc_type: raise HTTPException(status_code=400, detail="bad request")
    last_doc = document_logic.get_one_last_type_status(db_session, doc_type.id, status.id, skip)
    if not last_doc: raise HTTPException(status_code=404, detail="not found")
    fields = [{"name": item.name, "value": item.url, 'value_ocr': item.value} for item in last_doc.document_process]
    obj = {
        'id': last_doc.id, 
        'origin': {"name": "origin", "value": last_doc.url},
        'crop': {'name': 'crop', 'value': last_doc.crop_url},
        'fields': fields,
    }
    return obj
