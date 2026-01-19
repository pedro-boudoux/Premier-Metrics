import os
import glob
import psycopg2
from psycopg2 import OperationalError

# SQL Queries
# Reset all tables -> TRUNCATE TABLE {table_name} RESTART IDENTITY;
# Upload csv (?) -> COPY {table_name} FROM STDIN WITH CSV HEADER


DB_URL = os.environ.get("DATABASE_URL")

TABLES = {
    "advanced_goalkeeping",
    "defensive_actions",
    "goal_and_shot_conversion",
    "goalkeeping",
    "league_table",
    "miscstats",
    "passing",
    "passtypes",
    "players",
    "playing_time",
    "possession",
    "shooting",
    "teams"
}

def db_refresh():

    if not DB_URL:
        print("No DATABASE_URL found.")
        return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        print("Connected to Supabase.")

    except OperationalError as e:
        print("Connection to Supabase failed: {e}")

    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
    

