import os
import pandas as pd

def createPlayersTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called players.csv with columns:
    id, first_name, last_name, nation, team, positions, age, yellow_cards, red_cards.
    Reads every CSV in tables/playing_time/ and extracts the required columns.
    Skips rows that are headers or do not contain valid player data.
    Merges yellow_cards and red_cards from misc_stats tables by player and team.
    """    # Set up paths
    if base_dir is None:
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    playing_time_dir = os.path.join(base_dir, 'playing_time')
    misc_stats_dir = os.path.join(base_dir, 'misc_stats')
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'players.csv')

    # Build a dict of misc_stats for quick lookup: {(team, player): {yellow_cards, red_cards}}
    misc_lookup = {}
    for misc_file in os.listdir(misc_stats_dir):
        if misc_file.endswith('.csv'):
            team_name = misc_file.split('-')[0].replace('_', ' ')
            misc_path = os.path.join(misc_stats_dir, misc_file)
            misc_df = pd.read_csv(misc_path)
            for _, row in misc_df.iterrows():
                player = row['player'] if 'player' in row else row.get('Player', None)
                if pd.isnull(player) or player == 'player':
                    continue
                key = (team_name, player)
                yellow = row['yellow_cards'] if 'yellow_cards' in row else np.nan
                red = row['red_cards'] if 'red_cards' in row else np.nan
                misc_lookup[key] = {
                    'yellow_cards': yellow if not pd.isnull(yellow) else '',
                    'red_cards': red if not pd.isnull(red) else ''
                }

    all_rows = []
    for csv_file in os.listdir(playing_time_dir):
        if csv_file.endswith('.csv'):
            team_name = csv_file.split('-')[0].replace('_', ' ')
            csv_path = os.path.join(playing_time_dir, csv_file)
            df = pd.read_csv(csv_path)
            # Use lowercase column names as per helpers' renaming
            if 'player' in df.columns:
                valid_rows = df[df['player'].notnull()]
                for _, row in valid_rows.iterrows():
                    # Skip header-like rows
                    if str(row['player']).strip().lower() == 'player':
                        continue
                    if 'nation' in row and str(row['nation']).strip().lower() == 'nation':
                        continue
                    if 'age' in row and str(row['age']).strip().lower() in ['ag', 'age']:
                        continue
                    if 'position' in row and str(row['position']).strip().lower() in ['pos', 'position']:
                        continue
                    player = row['player']
                    key = (team_name, player)
                    yellow = misc_lookup.get(key, {}).get('yellow_cards', '')
                    red = misc_lookup.get(key, {}).get('red_cards', '')
                    # Handle each field, converting empty strings to None/NaN
                    new_row = {
                        'id': len(all_rows) + 1,  # Generate sequential ID
                        'first_name': str(player).split(' ', 1)[0] if player and str(player).strip() else None,
                        'last_name': str(player).split(' ', 1)[1] if player and ' ' in str(player).strip() else (str(player).strip() if player and str(player).strip() else None),
                        'nation': row['nation'] if 'nation' in row and str(row['nation']).strip() else None,
                        'team': team_name if team_name and str(team_name).strip() else None,
                        'positions': row['position'] if 'position' in row and str(row['position']).strip() else None,
                        'age': pd.to_numeric(row['age'], errors='coerce') if 'age' in row else None,
                        'yellow_cards': pd.to_numeric(yellow, errors='coerce') if yellow and str(yellow).strip() else None,
                        'red_cards': pd.to_numeric(red, errors='coerce') if red and str(red).strip() else None
                    }
                    all_rows.append(new_row)
    
    # Create DataFrame with new column order including ID
    out_df = pd.DataFrame(all_rows, columns=['id', 'first_name', 'last_name', 'nation', 'team', 'positions', 'age', 'yellow_cards', 'red_cards'])
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")