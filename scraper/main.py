import psycopg2
from dotenv import load_dotenv
import os
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

load_dotenv()

conn = psycopg2.connect(
    host= "localhost", # temp
    database= os.getenv('PG_DATABASE'),
    user= os.getenv('PG_USER'),
    password= os.getenv('PG_PASSWORD'),
    port = os.getenv('PG_PORT')
)

db = conn.cursor()

tables_path = 'scraper/tables/'

if not os.path.exists(tables_path):
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