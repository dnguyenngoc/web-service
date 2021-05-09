# Python class represent the entities
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

# Shared properties
class FieldResponse(BaseModel):
    name: Optional[str]
    description: Optional[str]
    is_field: Optional[bool]
    create_date: Optional[datetime]
    export_date: Optional[datetime] = None
    class Config:
        orm_mode = True

