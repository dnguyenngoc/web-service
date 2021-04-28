from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from databases.db import get_db
from api.entities import workflow_v1_entity 
from databases.repository_logic import document_logic

router = APIRouter()


@router.get("/test")
def test():
    return 'test completed!'

# @router.get("/init-data"):
# def init_data():
#     document_type = [
#         {'id': 1, 'status_code': 100, 'status_name': 'import', description: 'import', 'create_date': '2021-04-16'},
#         {'id': 2, 'status_code': 200, 'status_name': 'split', description: 'import', 'create_date': '2021-04-16'},
#         {'id': 3, 'status_code': 300, 'status_name': 'extract', description: 'import', 'create_date': '2021-04-16'},
#         {'id': 4, 'status_code': 400, 'status_name': 'transform', description: 'import', 'create_date': '2021-04-16'}
#     ]
    


@router.post("/{type_id}/{status_id}/{day}")
def get_identity_card_by_day(*, db_session: Session = Depends(get_db), type_id: str, status_id: int, day: str):
    
    data = document_logic.get_list_document_by_date(db_session, type_id, status_id, day)
    return len(data)