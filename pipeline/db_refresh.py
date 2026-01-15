import os
import glob
import psycopg2
from psycopg2 import OperationalError


DB_URL = os.environ.get("DATABASE_URL")

def gw_update_table(cursor, csv_path, table_name):

    print(f"refreshing {table_name} from {csv_path}")

    try:
        with open(csv_path, 'r') as f:
            # truncate will preserve schema/indexes so we dont NUKE the database
            cursor.execute(f"TRUNCATE TABLE {table_name} RESTART IDENTITY;")
            cursor.copy_expert(f"COPY {table_name} FROM STDIN WITH CSV HEADER", f)

    except FileNotFoundError:
        print(f"!!!! skipped {table_name}: file not found at {csv_path}")
    except Exception as e:
        print(f"!!!! failed on {table_name}: {e}")

def gw_update_db():

    if not DB_URL:
        print("!!!! no database url found.")
        return
    
    try:
        conn = psycopg2.connect(DB_URL)
    except OperationalError as e:
        print(f"!!!! cannot connect to database")
        return None

    cur = conn.cursor()

    # handle tables in formatted/
    formatted_path = os.path.join("pipeline", "data", "formatted")
    for file in glob.glob(os.path.join(formatted_path, "*.csv")):
        # mapping each filename to a table name
        # i.e. shooting.csv -> shooting
        table_name = os.path.splitext(os.path.basename(file))[0]
        gw_update_table(cur, file, table_name)

    # handle teams table
    teams_csv = os.path.join("pipeline", "data", "teams.csv")
    gw_update_table(cur, teams_csv, "teams")

    conn.commit()
    conn.close()
    print("DB Refresh Complete.")
