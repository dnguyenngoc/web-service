import os

# PROJECT INFO
PROJECT_NAME = 'Web Service'
ENVIROMENT = os.getenv('ENVIRONMENT')
HOST_NAME = '161.117.87.31'
BE_PORT = 8081
FE_PORT = 8080

# DATABASE
if ENVIROMENT == 'production':
    SQLALCHEMY_DATABASE_URL = "postgresql://webscan:1q2w3e4r@10.1.33.80:5432/webscan"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./databases/web-scan.db"
    
# FTP CONFIG
FTP_USERNAME = 'upload'
FTP_PASSWORD = 'raspberry'
FTP_URL = '10.1.33.76'
FTP_PORT = 21

