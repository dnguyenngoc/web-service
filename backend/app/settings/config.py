import os

# PROJECT INFO
PROJECT_NAME = 'Web Service'
ENVIROMENT = os.getenv('ENVIRONMENT')

# DATABASE
SQLALCHEMY_DATABASE_URL = "sqlite:///./databases/web-scan.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://webscan:1q2w3e4r@10.1.33.80:5432/webscan"
