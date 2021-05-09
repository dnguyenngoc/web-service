from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload, raiseload
from databases.models import Status
from sqlalchemy import distinct
from sqlalchemy import func
import datetime


def read_by_status_code(db_session: Session, status_code: str) -> Status:
    return db_session.query(Status).filter(Status.status_code == status_code).first()