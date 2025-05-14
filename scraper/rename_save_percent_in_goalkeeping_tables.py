import os
import pandas as pd

def rename_save_percent_in_goalkeeping_tables(base_dir=None):
    """
    For all CSV files in the goalkeeping/ folder, rename any column named 'Save%.1' to 'PKSave%'.
    If base_dir is not provided, uses the tables directory relative to this script.
    """
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'goalkeeping')
    else:
        base_dir = os.path.join(base_dir, 'goalkeeping')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if 'Save%.1' in df.columns:
                df = df.rename(columns={'Save%.1': 'PKSave%'})
                print(f"Renamed 'Save%.1' to 'PKSave%' in {csv_file}")
                df.to_csv(csv_path, index=False)
            else:
                print(f"No 'Save%.1' column in {csv_file}")
