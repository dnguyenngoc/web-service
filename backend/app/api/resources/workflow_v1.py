from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from databases.db import get_db
from databases.repository_logic import document_logic


router = APIRouter()


@router.get("/full-workflow/pipeline")
def pipeline( *, db_session: Session = Depends(get_db)):
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
    

