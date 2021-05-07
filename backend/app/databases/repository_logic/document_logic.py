from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload, raiseload
from databases.models import Document, Status
from sqlalchemy import distinct
from sqlalchemy import func
import datetime


def count_all_type(db_session: Session, type_id: int) -> Document:
    return  db_session.query(Document).filter(Document.type_id==type_id).count()

def count_all_status(db_session: Session, status_id: int) -> Document:
    return  db_session.query(Document).filter(Document.status_id==status_id).count()

def count_all_type_and_status(db_session: Session, type_id: int, status_id: int) -> Document:
    return db_session.query(Document).filter(Document.type_id==type_id, Document.status_id==status_id).count()

def get_all_type_and_status_join_split_and_field(db_session: Session, type_id: int, status_id: int, page: int, limit: int) -> Document:
    return db_session.query(Document) \
                            .filter(Document.type_id==type_id, Document.status_id==status_id) \
                            .options(joinedload('document_split')) \
                            .options(joinedload('document_field')) \
                            .order_by(Document.update_date.desc()) \
                            .offset(limit*(page-1)) \
                            .limit(limit) \
                            .all()
