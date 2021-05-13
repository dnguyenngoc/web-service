from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from settings import config

from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from fastapi import Form
from fastapi import UploadFile
from helpers.ftp_utils import FTP
from helpers import time_utils
from io import BytesIO
from datetime import timedelta

from databases.db import get_db
from databases.db import get_engine
from databases.repository_logic import document_logic, document_process_logic, document_field_logic
from databases.repository_crud import document_crud, document_process_crud, document_type_crud
from databases.entities import document_entity, document_process_entity


router = APIRouter()


@router.post('/image/import')
def upload_image_ftp(
 *, 
    db_session: Session = Depends(get_db), 
    type_doc: str = Form(...),
    image: UploadFile = Form(...)
):
    status_name = 'import'
    if type_doc not in config.LIST_TYPE_DOC: raise HTTPException(status_code=400, detail="wrong type of doc")
    if status_name not in config.LIST_STATUS_NAME: raise HTTPException(status_code=400, detail="wrong status name of doc")
    if image.content_type not in config.LIST_IMAGE_TYPE: raise HTTPException(status_code=400, detail="wrong image type")
    byte_image = image.file.read()
    if len(byte_image) > config.IMAGE_MAX_SIZE: raise HTTPException(status_code=400, detail="wrong size image")
    name_document = time_utils.utc_now_string() + '.png'
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    string_date = time_utils.year_month_day_utc_string()
    path = type_doc + '/' + status_name + '/' + string_date
    ftp.chdir(path)
    ftp.upload_byte_image(byte_image, path + '/' + name_document)
    ftp.close()
    url = 'http://{host}:{port}/api/v1/ftp/image/{type_doc}/{status_name}/{string_date}/{name}'.format(
        host = config.BE_HOST, port = config.BE_PORT, type_doc = type_doc, status_name = status_name, string_date = string_date, name = name_document)
    data = document_entity.DocumentCreate(
            name = name_document,
            type_id = 1,
            url= url,
            status_id= 1,
            create_date= time_utils.utc_now()
        )
    end = document_crud.create(db_session, data)
    return end


@router.post('/image/split')
def upload_image_ftp_field(
    *, 
    db_session: Session = Depends(get_db),
    engine = Depends(get_engine), 
    document_id: int = Form(...),
    name: str = Form(...),
    field_name: str = Form(...),
    image: UploadFile = Form(...)
    
):
    if image.content_type not in config.LIST_IMAGE_TYPE: raise HTTPException(status_code=400, detail="wrong image type")
    byte_image = image.file.read()
    if len(byte_image) > config.IMAGE_MAX_SIZE: raise HTTPException(status_code=400, detail="wrong size image")
    
    doc = document_logic.get_by_id_join_type_join_status(db_session, document_id)    
    if not doc: raise HTTPException(status_code=400, detail="wrong doc id")
        
    field = document_field_logic.get_by_name(db_session, field_name)
    if not field: raise HTTPException(status_code=400, detail="wrong field")
    status_name = 'export'
    type_doc = doc.document_type.name
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    string_date = time_utils.year_month_day_utc_string()
    path = type_doc + '/' + status_name + '/' + string_date
    ftp.chdir(path)
    name = str(doc.id) +'_'+field_name + '.png'
    ftp.upload_byte_image(byte_image, path + '/' + name)
    ftp.close()
    url = 'http://{host}:{port}/api/v1/ftp/image/{type_doc}/{status_name}/{string_date}/{name}'.format(
        host = config.BE_HOST, port = config.BE_PORT, type_doc = type_doc, status_name = status_name, string_date = string_date, name = name)
    check_process = document_process_logic.read_by_document_id_and_field_id(engine, doc.id, field.id)
    if check_process == 0:
        data = document_process_crud.create(
            db_session, 
            document_process_entity.DocumentProcessCreate(
                name = field_name,
                value = None,
                is_extracted = False,
                type_id = doc.type_id,
                url= url,
                document_id = document_id, 
                field_id = field.id,
                create_date= time_utils.utc_now()
            )
        )
        return data
    else:
        data = document_process_crud.update(
            db_session, 
            doc.id,
            {
                'name' : field_name,
                'value' : None,
                'is_extracted' : False,
                'type_id' : doc.type_id,
                'url': url,
                'field_id' : field.id,
                'update_date': time_utils.utc_now()
            }
        )
        return data
        

        
@router.post('/image/document-crop')
def upload_image_ftp_crop(
    *, 
    db_session: Session = Depends(get_db), 
    document_id: int = Form(...),
    name: str = Form(...),
    image: UploadFile = Form(...)
    
):
    if image.content_type not in config.LIST_IMAGE_TYPE: raise HTTPException(status_code=400, detail="wrong image type")
    byte_image = image.file.read()
    
    if len(byte_image) > config.IMAGE_MAX_SIZE: raise HTTPException(status_code=400, detail="wrong size image")
    
    doc = document_logic.get_by_id_join_type_join_status(db_session, document_id) 
    if not doc: raise HTTPException(status_code=400, detail="wrong doc id")
        
    status_name = 'export'
    type_doc = doc.document_type.name
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    string_date = time_utils.year_month_day_utc_string()
    path = type_doc + '/' + status_name + '/' + string_date
    ftp.chdir(path)
    name = str(doc.id) + "_" + 'crop' + '.png'
    ftp.upload_byte_image(byte_image, path + '/' + name)
    ftp.close()
    url = 'http://{host}:{port}/api/v1/ftp/image/{type_doc}/{status_name}/{string_date}/{name}'.format(
        host = config.BE_HOST, port = config.BE_PORT, type_doc = type_doc, status_name = status_name, string_date = string_date, name = name)
    end = document_crud.update(db_session, document_id, {'crop_url': url, 'status_id': 2, 'update_date': time_utils.utc_now()})
    return end
    

    
@router.get("/image/{type_doc}/{status_name}/{date}/{name}")
def get_image_ftp(
    *, 
    db_session: Session = Depends(get_db), 
    type_doc: str,
    status_name: str,
    date: str,
    name: str,
):
    if name.split('.')[-1].lower() not in config.LIST_IMAGE_NAME_TYPE: raise HTTPException(status_code=400, detail="File type Not Allow")
    if status_name not in ['import', 'export', 'bad']: raise HTTPException(status_code=400, detail="wrong status name of doc")
    if type_doc not in config.LIST_TYPE_DOC: raise HTTPException(status_code=400, detail="wrong type of doc")
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    image = ftp.read(type_doc + '/' + status_name + '/' + date + '/' + name)
    ftp.close()
    return StreamingResponse(BytesIO(image), media_type="image/png")
    
    
