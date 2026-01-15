"""
Playing time table formatter.
"""
import pandas as pd
from .helpers import (
    PLAYING_TIME_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_playing_time_table():
    """Create the playing time stats table."""
    print("[FORMAT] Creating playing time table...")
    
    pt_data = []
    pt_files = load_team_csvs("playing_time")
    
    for csv_file in pt_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=PLAYING_TIME_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                pt_data.append({
                    'player_name': player,
                    'team': team_name,
                    'matches_played': row.get('matches_played', 0),
                    'minutes_played': row.get('minutes_played', 0),
                    'minutes_per_match': row.get('minutes_per_match', 0),
                    'percent_squad_mins': row.get('percent_squad_mins', ''),
                    'nineties_played': row.get('nineties_played', 0),
                    'starts': row.get('starts', 0),
                    'minutes_per_start': row.get('minutes_per_start', ''),
                    'complete_matches': row.get('complete_matches', 0),
                    'sub_appearances': row.get('sub_appearances', 0),
                    'minutes_per_sub': row.get('minutes_per_sub', ''),
                    'unused_sub_matches': row.get('unused_sub_matches', 0),
                    'points_per_match': row.get('points_per_match', 0),
                    'team_goals_for': row.get('team_goals_for', 0),
                    'team_goals_against': row.get('team_goals_against', 0),
                    'goal_diff': row.get('goal_diff', 0),
                    'goal_diff_per_90': row.get('goal_diff_per_90', 0),
                    'net_goal_diff_per_90': row.get('net_goal_diff_per_90', ''),
                    'team_xg': row.get('team_xg', 0),
                    'team_xga': row.get('team_xga', 0),
                    'team_xg_diff': row.get('team_xg_diff', 0),
                    'team_xg_diff_per_90': row.get('team_xg_diff_per_90', 0),
                    'team_xg_plus_minus_net_diff': row.get('team_xg_plus_minus_net_diff', ''),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not pt_data:
        print("   x no playing time data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(pt_data)
    save_formatted_table(result, "playing_time")
    return result
