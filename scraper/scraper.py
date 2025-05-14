import pandas as pd

df = pd.read_html('https://fbref.com/en/comps/9/Premier-League-Stats', attrs={"id" : "results2024-202591_overall"})

df.columns.values()