from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload, raiseload
from databases.models import DocumentField
from sqlalchemy import distinct
from sqlalchemy import func
import datetime


def get_by_name(db_session: Session, name: str) -> DocumentField:
    return db_session.query(DocumentField).filter(DocumentField.name == name).first()