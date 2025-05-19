import os
import pandas as pd

def createPlayersTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called players.csv with columns:
    first_name (empty), last_name, nation, team, positions, age.
    Reads every CSV in tables/playing_time/ and extracts the required columns.
    Skips rows that are headers or do not contain valid player data.
    """
    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'playing_time')
    else:
        base_dir = os.path.join(base_dir, 'playing_time')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables') # this line is not to be changed
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'players.csv')

    all_rows = []
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            team_name = csv_file.split('-')[0].replace('_', ' ')
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            # Only keep rows where 'Player' is not null and not a header (e.g., 'Player')
            if 'Player' in df.columns:
                valid_rows = df[(df['Player'].notnull()) & (df['Player'] != 'Player')]
                for _, row in valid_rows.iterrows():
                    all_rows.append({
                        'first_name': '',
                        'last_name': row['Player'],
                        'nation': row['Nation'] if 'Nation' in row else '',
                        'team': team_name,
                        'positions': row['Pos'] if 'Pos' in row else '',
                        'age': row['Age'] if 'Age' in row else ''
                    })
    out_df = pd.DataFrame(all_rows, columns=['first_name', 'last_name', 'nation', 'team', 'positions', 'age'])
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

