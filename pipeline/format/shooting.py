"""
Shooting table formatter.
"""
import pandas as pd
from .helpers import (
    RAW_TABLES_DIR, SHOOTING_COLUMNS, PLAYERS_COLUMNS,
    get_team_from_filename, fix_age, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_shooting_table():
    """
    Create the shooting stats table.
    Merges with players data to get non_pk_goals.
    """
    print("[FORMAT] Creating shooting table...")
    
    # Load players data for non_pk_goals lookup
    players_lookup = {}
    players_files = load_team_csvs("players")
    
    for csv_file in players_files:
        team_name = get_team_from_filename(csv_file.name)
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=PLAYERS_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                player = str(row.get('player', '')).strip()
                key = (player, team_name)
                players_lookup[key] = {
                    'non_pk_goals': row.get('non_pk_goals', 0)
                }
        except Exception as e:
            print(f"   x error loading players {csv_file.name}: {e}")
    
    # Build shooting table
    shooting_data = []
    shooting_files = load_team_csvs("shooting")
    
    for csv_file in shooting_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=SHOOTING_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                player_data = players_lookup.get((player, team_name), {})
                
                shooting_data.append({
                    'player_name': player,
                    'team': team_name,
                    'total_shots': row.get('total_shots', 0),
                    'shots_on_target': row.get('shots_on_target', 0),
                    'shots_on_target_percent': row.get('shots_on_target_percent', ''),
                    'shots_per_90': row.get('shots_per_90', 0),
                    'shots_on_target_per_90': row.get('shots_on_target_per_90', 0),
                    'goals_per_shot': row.get('goals_per_shot', ''),
                    'goals_per_shot_on_target': row.get('goals_per_shot_on_target', ''),
                    'average_shot_distance': row.get('average_shot_distance', ''),
                    'shots_from_fks': row.get('shots_from_fks', 0),
                    'pk_scored': row.get('pk_scored', 0),
                    'pk_attempted': row.get('pk_attempted', 0),
                    'xg': row.get('xg', 0),
                    'npxg': row.get('npxg', 0),
                    'npxg_per_shot': row.get('npxg_per_shot', ''),
                    'goals_xg_diff': row.get('goals_xg_diff', 0),
                    'np_goals_npxg_diff': row.get('np_goals_npxg_diff', 0),
                    'goals': row.get('goals', 0),
                    'non_pk_goals': player_data.get('non_pk_goals', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not shooting_data:
        print("   x no shooting data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(shooting_data)
    save_formatted_table(result, "shooting")
    return result
