from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from databases.db import get_db
from api.entities import workflow_v1_entity 
from databases.repository_logic import document_logic

from settings import config
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from fastapi import Form

from helpers.ftp_utils import FTP
from helpers import time_utils


router = APIRouter()


@router.get("/test")
def test():
    return 'test completed!'

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
    fpt_image_path = '/home/pot/project/web-service/backend/app/fake_data/' + type_doc + '/' + status_name + '/' + date + '/' + name
    file_like = open(fpt_image_path, mode="rb")
    return StreamingResponse(file_like, media_type="image/jpeg")
#     ftp = FTP(config.FTP_URL, config.FTP_USERNAME, config.FTP_PASSWORD)
#     ftp.connect()
#     data = ftp.read(fpt_image_path)
#     return data


@router.post("/preview/{type}")
def get_identity_card_by_day(
    *, 
    db_session: Session = Depends(get_db), 
    type: str,
    type_name: str = Form(...), 
    status_name: str = Form(...), 
    day: str = Form(...)
):
    if time_utils.is_string_time(day, '%Y-%m-%d') == False:
#         print(day)
        raise HTTPException(status_code=400, detail="day is string yyyy-mm-dd") 
    
    from fake_data import fake
    if type_name == 'identity_card':
        return fake.identity_card
    else:
        return fake.discharge_record
    
@router.get("/preview/full-worflow/pipeline")
def pipeline(
     *, 
    db_session: Session = Depends(get_db)
):
    return {
        'import': 100,
        'identityCardGood': 1,
        'identityCardBad': 2,
        'dischargeRecordGood': 3,
        'dischargeRecordBad': 4,
        'fieldExtractIdentityCard': 5,
        'fieldExtractDischargeRecord': 6,
        'ocrIdentityCard': 7,
        'ocrDischargeRecord': 8,
        'transformIdentityCard': 9,
        'transformDischargeRecord': 10,
    }
    

