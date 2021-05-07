from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from databases.db import get_db
from api.entities import workflow_v1_entity 
from databases.repository_logic import document_logic
from databases.repository_crud import document_crud
from databases.entities import document_entity

from settings import config
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from fastapi import Form
from fastapi import UploadFile

from helpers.ftp_utils import FTP
from helpers import time_utils
from io import BytesIO


router = APIRouter()


@router.get("/test")
def test():
    return 'test completed!'

@router.post('/ftp/image')
def upload_image_ftp(
 *, 
    db_session: Session = Depends(get_db), 
    type_doc: str = Form(...),
    status_name: str = Form(...),
    image: UploadFile = Form(...)
):
    if type_doc not in ['identity-card', 'discharge-record']:
        raise HTTPException(status_code=400, detail="wrong type of doc")
    if status_name not in ['import', 'export', 'bad']:
        raise HTTPException(status_code=400, detail="wrong status name of doc")
    if image.content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(status_code=400, detail="wrong image type")
    byte_image = image.file.read()
    if len(byte_image) > 15**22:
        raise HTTPException(status_code=400, detail="wrong size image")
    name_document = time_utils.utc_now_string() + '.png'
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    string_date = time_utils.year_month_day_utc_string()
    try:
        path = type_doc + '/' + status_name + '/' + string_date
        ftp.chdir(path)
        ftp.upload_byte_image(byte_image, path + '/' + name_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail="ftp error: " + str(e))
    ftp.close()
    url = 'http://{host}:{port}/api/v1/worflow-v1/image/{type_doc}/{status_name}/{string_date}/{name}' \
        .format(host = config.BE_HOST, port = config.BE_PORT, type_doc = type_doc, status_name = status_name, string_date = string_date, name = name_document)
    data = document_entity.DocumentCreate(
        name = name_document,
        type_id = 1,
        url= url,
        status_id= 1,
        create_date= time_utils.utc_now()
    )
    end = document_crud.create(db_session, data)
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
    type_file = name.split('.')[-1]
    if type_file.lower() not in ['jpg','jpeg','png']:
         raise HTTPException(status_code=400, detail="File type Not Allow")
    if status_name not in ['import', 'export', 'bad']:
        raise HTTPException(status_code=400, detail="wrong status name of doc")
    if type_doc not in ['identity-card', 'discharge-record']:
        raise HTTPException(status_code=400, detail="wrong type of doc")
    ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
    ftp.connect()
    try:
        image = ftp.read(type_doc + '/' + status_name + '/' + date + '/' + name)
    except Exception as e:
        raise HTTPException(status_code=500, detail="ftp error: " + str(e))
    ftp.close()
    return StreamingResponse(BytesIO(image), media_type="image/png")
    

@router.post("/preview")
def get_identity_card_by_day(
    *, 
    db_session: Session = Depends(get_db), 
    type_id: int = Form(...), 
    status_id: int = Form(...), 
    day: str = Form(...)
):
    if time_utils.is_string_time(day, '%Y-%m-%d') == False:
        raise HTTPException(status_code=400, detail="day is string yyyy-mm-dd") 
    data = document_logic.get_all_type_and_status_join_split_and_field(db_session, type_id, status_id, page = 1, limit = 100)
    return data
   
    
@router.get("/preview/full-worflow/pipeline")
def pipeline(
     *, 
    db_session: Session = Depends(get_db)
):
    return {
        'import': document_logic.count_all_status(db_session, 1),
        'identityCardGood': document_logic.count_all_type_and_status(db_session, 1, 1),
        'identityCardBad': document_logic.count_all_type_and_status(db_session, 1, 5),
        'dischargeRecordGood': document_logic.count_all_type_and_status(db_session, 2, 1),
        'dischargeRecordBad': document_logic.count_all_type_and_status(db_session, 2, 5),
        'fieldExtractIdentityCard': document_logic.count_all_type_and_status(db_session, 1, 2),
        'fieldExtractDischargeRecord': document_logic.count_all_type_and_status(db_session, 2, 2),
        'ocrIdentityCard': document_logic.count_all_type_and_status(db_session, 1, 3),
        'ocrDischargeRecord': document_logic.count_all_type_and_status(db_session, 2, 3),
        'transformIdentityCard': document_logic.count_all_type_and_status(db_session, 1, 4),
        'transformDischargeRecord': document_logic.count_all_type_and_status(db_session, 2, 4),
    }
    

