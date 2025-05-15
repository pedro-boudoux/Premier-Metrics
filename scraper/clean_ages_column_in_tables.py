import os
import pandas as pd

def clean_ages_column_in_tables(base_dir=None):
    """
    Goes through every CSV file in every folder in tables/ and changes the 'Age' column
    to only keep the first two digits (e.g., '22-099' -> '22').
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

                    if 'Age' in df.columns:
                        
                        df['Age'] = df['Age'].astype(str).str[:2]
                        df.to_csv(csv_path, index=False)
                        print(f"Cleaned 'Age' column in {csv_file}")
