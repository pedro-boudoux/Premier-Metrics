import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

conn = psycopg2.connect(
    host= "localhost",
    database= os.getenv('PG_DATABASE'),
    user= os.getenv('PG_USER'),
    password= os.getenv('PG_PASSWORD'),
    port = os.getenv('PG_PORT')
)

db = conn.cursor()

