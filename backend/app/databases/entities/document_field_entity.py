# Python class represent the entities

from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


# Shared properties
class DocumentFieldBase(BaseModel):
    name: Optional[str]
    type_id: Optional[int]
    url: Optional[str]
    status_id: Optional[int]
    create_date: Optional[datetime]
    export_date: Optional[datetime] = None
    class Config:
        orm_mode = True

class DocumentFieldInDB(DocumentBase):
    id: Optional[int]

# Create Document info
class DocumentFieldCreate(BaseModel):
    name: Optional[str]
    type_id: Optional[int]
    url: Optional[str]
    status_id: Optional[int]
    create_date: Optional[datetime]