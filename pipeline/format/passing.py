"""
Passing table formatter.
"""
import pandas as pd
from .helpers import (
    PASSING_COLUMNS, PLAYERS_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_passing_table():
    """
    Create the passing stats table.
    Merges with players data to get assists_from_summary.
    """
    print("[FORMAT] Creating passing table...")
    
    # Load players data for assists lookup
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
                    'assists': row.get('assists', 0)
                }
        except Exception as e:
            print(f"   x error loading players {csv_file.name}: {e}")
    
    # Build passing table
    passing_data = []
    passing_files = load_team_csvs("passing")
    
    for csv_file in passing_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=PASSING_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                player_data = players_lookup.get((player, team_name), {})
                
                passing_data.append({
                    'player_name': player,
                    'team': team_name,
                    'total_passes_completed': row.get('total_passes_completed', 0),
                    'total_passes_attempted': row.get('total_passes_attempted', 0),
                    'pass_completion_percentage': row.get('pass_completion_percentage', ''),
                    'total_passing_distance': row.get('total_passing_distance', 0),
                    'progressive_passing_distance': row.get('progressive_passing_distance', 0),
                    'short_passes_completed': row.get('short_passes_completed', 0),
                    'short_passes_attempted': row.get('short_passes_attempted', 0),
                    'short_pass_completion_percentage': row.get('short_pass_completion_percentage', ''),
                    'medium_passes_completed': row.get('medium_passes_completed', 0),
                    'medium_passes_attempted': row.get('medium_passes_attempted', 0),
                    'medium_pass_completion_percentage': row.get('medium_pass_completion_percentage', ''),
                    'long_passes_completed': row.get('long_passes_completed', 0),
                    'long_passes_attempted': row.get('long_passes_attempted', 0),
                    'long_pass_completion_percentage': row.get('long_pass_completion_percentage', ''),
                    'assists': row.get('assists', 0),
                    'xag': row.get('xag', 0),
                    'xa': row.get('xa', 0),
                    'assist_xag_diff': row.get('assist_xag_diff', 0),
                    'key_passes': row.get('key_passes', 0),
                    'passes_into_final_third': row.get('passes_into_final_third', 0),
                    'passes_into_penalty_area': row.get('passes_into_penalty_area', 0),
                    'crosses_into_penalty_area': row.get('crosses_into_penalty_area', 0),
                    'progressive_passes': row.get('progressive_passes', 0),
                    'assists_from_summary': player_data.get('assists', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not passing_data:
        print("   x no passing data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(passing_data)
    save_formatted_table(result, "passing")
    return result
