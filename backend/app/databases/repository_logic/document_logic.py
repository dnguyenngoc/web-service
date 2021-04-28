from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload, raiseload
from databases.models import Document, Status
from datetime import datetime
# from sqlalchemy import desc

def get_list_document_by_date(db_session: Session, type_id: int, status_id: int, day: datetime) -> Document:
    return db_session.query(Document) \
                     .options(joinedload('status')) \
                     .options(joinedload('document_split')) \
                     .options(joinedload('type')) \
                     .filter(Document.type_id == type_id, 
                             Document.status_id == status_id, 
                             Document.export_date == day) \
                     .order_by(Document.export_date.desc()) \
                     .all()

