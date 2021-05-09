from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload, raiseload
from databases.models import DocumentType
from sqlalchemy import distinct
from sqlalchemy import func
import datetime


def read_all(db_session: Session, id: int) -> DocumentType:
    return db_session.query(DocumentType).filter(DocumentType.id == id).all()

def read_by_nane(db_session: Session, name: str) -> DocumentType:
    return db_session.query(DocumentType).filter(DocumentType.name == name).first()