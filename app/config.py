import os
from pathlib import Path
from dotenv import load_dotenv

# Busca el .env en la raíz del proyecto (junto a app.py), sin depender de desde dónde ejecutes Flask
load_dotenv(Path(__file__).resolve().parent.parent / '.env')

class Config:
    DB_HOST = '127.0.0.1'
    DB_PORT = 3306
    DB_USER = 'donlorenzo'
    DB_PASSWORD = 'DonLorenzo2026'
    DB_NAME = 'donlorenzo'