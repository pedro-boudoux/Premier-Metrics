import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="your_database",
    user="your_user",
    password="your_password"
)

db = conn.cursor()
