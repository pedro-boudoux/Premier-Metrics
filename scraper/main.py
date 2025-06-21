# === === === === === === === === === 
# PREMIER METRICS DATA SCRAPER v1.0 #
# === === === === === === === === === 

# === === === === === === === === === 
# INSTRUCTIONS
# 1. Navigate to ~/scraper/ folder
# 2. Run 'python.exe main.py --enable-unsafe-swiftshader'
# 3. Nice 
# === === === === === === === === === 

import psycopg2
from dotenv import load_dotenv
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import helpers
import format.players as players
import format.shooting as shooting
import format.goalkeeping as goalkeeping
import format.gsconversion as gsconversion
import format.passing as passing
import format.passtypes as passtypes
import format.defensiveactions as defensiveactions
import format.possession as possession
import format.playingtime as playingtime
import format.miscstats as miscstats
import glob
import postgres


load_dotenv()

# CUSTOM MODES
custom = {
    "RESET_DATA": True,
    "USER_ENTER_PG_INFO": False,
    "CLEAN_UP_TABLES" : True,
    "FORMAT_TABLES" : True,
    "ADJUSTMENTS" : True
}

if custom["USER_ENTER_PG_INFO"] is True:
    host = input("Enter Host: ")
    user = input("Enter username: ")
    password = input("Enter password: ")
    database = input("Enter Database name: ")
    port = input("Enter port: ")

    conn = psycopg2.connect(
        host = host,
        user = user,
        password = password,
        database = database,
        port = port
    )
else :
    conn = psycopg2.connect(
        host= "localhost", # temp
        database= os.getenv('PG_DATABASE'),
        user= os.getenv('PG_USER'),
        password= os.getenv('PG_PASSWORD'),
        port = os.getenv('PG_PORT')
    )

db = conn.cursor()


tables_path = 'raw_tables'

# Create tables directory if it doesn't exist
os.makedirs(tables_path, exist_ok=True)  

if (not os.path.exists(tables_path) or custom["RESET_DATA"]):

    # delete all data from the postgres tables
    db.execute('''\
        TRUNCATE TABLE
            advanced_goalkeeping,
            defensive_actions,
            goal_and_shot_conversion,
            goalkeeping,
            misc_stats,
            pass_types,
            passing,
            players,
            playing_time,
            possession,
            shooting
        RESTART IDENTITY CASCADE;
    ''')
    conn.commit()
    print("All tables truncated.")    # Opens Jupyter Notebook files and runs them without saving
    with open("prem.ipynb") as p:
        prem = nbformat.read(p, as_version=4)

    with open("teams.ipynb") as t:
        teams = nbformat.read(t, as_version=4)

    # Create a single ExecutePreprocessor instance
        ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

    # Run the notebooks in memory (no saving)
    ep.preprocess(prem, {'metadata': {'path': './'}})
    ep.preprocess(teams, {'metadata': {'path': './'}})

else:
    print("%s already exists! \nNot running Scraping Scripts" % tables_path)

# Cleans up tables to make sure they can be fixed up later on
if custom["CLEAN_UP_TABLES"] is True:
    print("Cleaning up tables")

    print("Removing bloat columns")
    helpers.removeBloatCols()

    print("Renaming similarly named columns in the goalkeeping tables")
    helpers.cleanGkCols()

    print("Checking for duplicate column names across all spreadsheets")
    helpers.checkDuplicateCols()

    print("Re-formatting age columns")
    helpers.fixAgeCols()

    print("Renaming ALL Columns")
    helpers.renameShootingCols()
    helpers.renameGoalkeepingCols()
    helpers.renameAdvancedGoalkeepingCols()
    helpers.renamePassingCols()
    helpers.renamePassTypesCols()
    helpers.renameGoalAndShotCreationCols()
    helpers.renameDefensiveActionsCols()
    helpers.renamePossessionCols()
    helpers.renamePlayingTimeCols()
    helpers.renameMiscStatsCols()
    helpers.renamePlayerSummariesCols()

# Formatting the tables
if custom["FORMAT_TABLES"] is True:
    print("=========== FORMATTING TABLES ===========")
    print("Creating Players Table...")

    players.createPlayersTable()
    shooting.createShootingTable()
    goalkeeping.createGoalkeepingTable()
    goalkeeping.createAdvancedGoalkeepingTable()
    passing.createPassingTable()
    passtypes.createPassTypesTable()
    gsconversion.createGoalAndShotConversionTable()
    defensiveactions.createDefensiveActionsTable()
    possession.createPossessionTable()
    playingtime.createPlayingTimeTable()
    miscstats.createMiscStatsTable()


# Import all formatted_tables/*.csv to Postgres
formatted_dir = os.path.join(os.path.dirname(__file__), 'formatted_tables')
for csv_file in glob.glob(os.path.join(formatted_dir, '*.csv')):
    table_name = os.path.splitext(os.path.basename(csv_file))[0]
    print(f"Importing {csv_file} into table {table_name}...")
    postgres.import_csv_to_postgres(csv_file, table_name, conn)
print("All formatted tables imported to Postgres.")

# Final Adjustments 

if custom["ADJUSTMENTS"] is True:
    try:

        # Makes it so players that have just one name, have just one name (i.e: Richarlison, and other Brazilians)
        print("Fixing Brazilian players' last names")
        db.execute("UPDATE players SET last_name = NULL WHERE first_name = last_name;")
        conn.commit()
        print(f"{db.rowcount} rows updated.")

        # Creates a full_name row in players
        print("Creating full_name column in players")
        db.execute("""
            ALTER TABLE players
            ADD COLUMN IF NOT EXISTS full_name TEXT GENERATED ALWAYS AS (
            TRIM(
            COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
            )
            ) STORED;
        """)
        conn.commit()
        
    except Exception as e:
        print("Error updating Brazilian players' last names:", e)
    print("DONE")


    try:
        # Removes bloat rows for players called "Squad Total" and "Opponent Total"
        print("Removing totals rows")
        
        tables = [
        "advanced_goalkeeping", "defensive_actions", "goal_and_shot_conversion",
        "goalkeeping", "misc_stats", "pass_types", "passing",
        "playing_time", "possession", "shooting"
        ]

        for table in tables:
            db.execute(f"DELETE FROM {table} WHERE player_name = 'Squad Total';")
            db.execute(f"DELETE FROM {table} WHERE player_name = 'Opponent Total';")

        db.execute("DELETE FROM players WHERE full_name = 'Squad Total';")
        db.execute("DELETE FROM players WHERE full_name = 'Opponent Total';")

        conn.commit()


    except Exception as e:
        print("ERROR removing totals rows.")
        print(e)
    
    print("DONE")

