import os

# PROJECT INFO
PROJECT_NAME = 'Web Service'
ENVIRONMENT = os.getenv('ENVIRONMENT')
HOST_NAME = 'www.digi-scan.vn'

LIST_TYPE_DOC = ['identity-card', 'discharge-record']
LIST_STATUS_NAME = ['import', 'export', 'bad', 'transform']
LIST_QUALITY_DOC_TYPE_NAME = ['bad', 'good']
LIST_IMAGE_TYPE = ['image/jpeg', 'image/png']
LIST_IMAGE_NAME_TYPE = ['jpg','jpeg','png']
IMAGE_MAX_SIZE = 15**22

BE_PORT = 8081
FE_PORT = 8080


if ENVIRONMENT == 'staging':
    SQLALCHEMY_DATABASE_URL = "postgresql://webscan:1q2w3e4r@161.117.87.31:5432/webscan"
    FTP_USERNAME = 'pot'
    FTP_PASSWORD = 'D@123123'
    FTP_URL = '161.117.87.31'
    FTP_PORT = 21
    BE_HOST = '161.117.87.31'

elif ENVIRONMENT == 'production':
    SQLALCHEMY_DATABASE_URL = "postgresql://webscan:1q2w3e4r@192.168.15.18:5432/webscan"
    FTP_USERNAME = 'upload'
    FTP_PASSWORD = 'raspberry'
    FTP_URL = '192.168.15.17'
    FTP_PORT = 21
    BE_HOST = '10.1.33.76'
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./databases/web-scan.db"