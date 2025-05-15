import os
import pandas as pd

def clean_tables(base_dir=None):
    """
    Reads all CSV files in each folder inside tables/ and removes columns titled 'Matches' and rows called 'Total'.
    If base_dir is not provided, uses the tables directory relative to this script.
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables')

    for stat_folder in os.listdir(base_dir):

        stat_folder_path = os.path.join(base_dir, stat_folder)

        if os.path.isdir(stat_folder_path):

            for csv_file in os.listdir(stat_folder_path):

                if csv_file.endswith('.csv'):

                    csv_path = os.path.join(stat_folder_path, csv_file)
                    df = pd.read_csv(csv_path)

                    if 'Matches' in df.columns:

                        df = df.drop(columns=['Matches'])
                        
                    first_col = df.columns[0]
                    df = df[df[first_col] != 'Total']
                    df.to_csv(csv_path, index=False)
