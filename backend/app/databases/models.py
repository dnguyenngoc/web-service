from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Boolean, DECIMAL
from sqlalchemy.orm import relationship
from databases.db import Base, engine, db_session

    
class Status(Base):
    __tablename__ = "status"
    id = Column(Integer, primary_key=True, index=True)
    status_code = Column(Integer)
    status_name = Column(String, nullable=True)
    description = Column(String)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)

    
class DocumentType(Base):
    __tablename__ = "document_type"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)

    
class DocumentField(Base):
    __tablename__ = "document_field"
    id = Column(Integer, primary_key=True, index=True)
    type_id = Column(Integer,ForeignKey('document_type.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_performance = Column(Boolean, nullable=False, default=True)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)
    document_type = relationship('DocumentType', lazy = 'noload', foreign_keys=[type_id])
    
    
class Document(Base):
    __tablename__ = "document"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    crop_url = Column(String, nullable=True, default= None)
    export_date = Column(DateTime, nullable=True, default=None)
#     transform_date = Column(DateTime, nullable=True, default=None)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)
    type_id = Column(Integer,ForeignKey('document_type.id'), nullable=False)
    status_id = Column(Integer,ForeignKey('status.id'), nullable=False)
    
    document_type = relationship('DocumentType', lazy = 'noload', foreign_keys=[type_id])
    status = relationship('Status', lazy = 'noload', foreign_keys=[status_id])
    document_process = relationship("DocumentProcess", lazy='noload', back_populates="document")


class DocumentProcess(Base):
    __tablename__ = "document_process"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=True, default=None)
    is_extracted = Column(Boolean, nullable = False, default = False)
    url = Column(String, nullable=False)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)
    type_id = Column(Integer,ForeignKey('document_type.id'), nullable=False)
    document_id = Column(Integer, ForeignKey("document.id"), nullable=False)
    field_id = Column(Integer, ForeignKey('document_field.id'), nullable = False)
    field = relationship('DocumentField', lazy = 'noload', foreign_keys=[field_id])
    type = relationship('DocumentType', lazy = 'noload', foreign_keys=[type_id])
    document = relationship('Document', lazy = 'noload', uselist=False, back_populates="document_process")
    

class DocumentTransForm(Base):
    __tablename__ = "document_transform"
    id = Column(Integer, primary_key=True, index=True)
    type_id = Column(Integer,ForeignKey('document_type.id'), nullable=False)
    type = relationship('DocumentType', lazy = 'noload', foreign_keys=[type_id])
    value = Column(String, nullable=False)
    create_date = Column(DateTime, nullable=False)
    update_date = Column(DateTime, nullable=True, default=None)

Base.metadata.create_all(bind=engine)