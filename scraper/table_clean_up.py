import os
import pandas as pd
from clean_tables import clean_tables
from rename_save_percent_in_goalkeeping_tables import rename_save_percent_in_goalkeeping_tables
from check_duplicate_column_names_in_tables import check_duplicate_column_names_in_tables

# clean_tables()
# rename_save_percent_in_goalkeeping_tables()
check_duplicate_column_names_in_tables()

df_list = pd.read_html('https://fbref.com/en/comps/9/Premier-League-Stats', attrs={"id" : "results2024-202591_overall"})
df = df_list[0]
# print(df.columns)
