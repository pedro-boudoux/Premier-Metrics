import os
import pandas as pd

def check_duplicate_column_names_in_tables(base_dir=None):
    """
    Checks one CSV file in each folder inside tables/ for duplicate column names.
    Prints the name of the folder if a file with duplicate column names is found.
    Otherwise, prints a message for each folder and a summary at the end.
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables')

    found_duplicate = False

    for stat_folder in os.listdir(base_dir):

        stat_folder_path = os.path.join(base_dir, stat_folder)

        if os.path.isdir(stat_folder_path):

            # Find the first CSV file in the folder
            csv_files = [f for f in os.listdir(stat_folder_path) if f.endswith('.csv')]

            if csv_files:

                csv_path = os.path.join(stat_folder_path, csv_files[0])
                df = pd.read_csv(csv_path)
                col_counts = df.columns.value_counts()

                if any(col_counts > 1):

                    print(f"Duplicate column names found in folder: {stat_folder}")
                    found_duplicate = True

                else:

                    print(f"No duplicate columns in {stat_folder}")

    if not found_duplicate:
        
        print("no duplicate columns at all")
