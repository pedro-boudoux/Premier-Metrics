import psycopg2
from dotenv import load_dotenv
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import helpers
import format

load_dotenv()

# CUSTOM MODES
custom = {
    "RESET_DATA": False,
    "USER_ENTER_PG_INFO": False,
    "CLEAN_UP_TABLES" : True,
    "FORMAT_TABLES" : True
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


# Conditionally runs scraper again depending on if we have a tables folder or not, or if we want to reset the data and scrape new data
tables_path = 'scraper/tables/'

if (not os.path.exists(tables_path) or custom["RESET_DATA"]):
    # Opens Jupyter Notebook files and runs them without saving
    with open("scraper/prem.ipynb") as p:
        prem = nbformat.read(p, as_version=4)

    with open("scraper/teams.ipynb") as t:
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
    #helpers.removeBloatCols()

    print("Renaming similarly named columns in the goalkeeping tables")
    #helpers.cleanGkCols()

    print("Checking for duplicate column names across all spreadsheets")
    #helpers.checkDuplicateCols()

    print("Re-formatting age columns")
    #helpers.fixAgeCols()

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
    #format.createPlayersTable()