"""
Possession table formatter.
"""
import pandas as pd
from .helpers import (
    POSSESSION_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_possession_table():
    """Create the possession stats table."""
    print("[FORMAT] Creating possession table...")
    
    poss_data = []
    poss_files = load_team_csvs("possession")
    
    for csv_file in poss_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=POSSESSION_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                poss_data.append({
                    'player_name': player,
                    'team': team_name,
                    'touches': row.get('touches', 0),
                    'touches_in_def_pen_area': row.get('touches_in_def_pen_area', 0),
                    'touches_in_def_third': row.get('touches_in_def_third', 0),
                    'touches_in_mid_third': row.get('touches_in_mid_third', 0),
                    'touches_in_att_third': row.get('touches_in_att_third', 0),
                    'touches_in_att_pen_area': row.get('touches_in_att_pen_area', 0),
                    'live_ball_touches': row.get('live_ball_touches', 0),
                    'attempted_take_ons': row.get('attempted_take_ons', 0),
                    'successful_take_ons': row.get('successful_take_ons', 0),
                    'successful_take_ons_percent': row.get('successful_take_ons_percent', ''),
                    'tackled_during_take_on': row.get('tackled_during_take_on', 0),
                    'tackled_during_take_on_percent': row.get('tackled_during_take_on_percent', ''),
                    'carries': row.get('carries', 0),
                    'total_carrying_distance': row.get('total_carrying_distance', 0),
                    'progressive_carrying_distance': row.get('progressive_carrying_distance', 0),
                    'progressive_carries': row.get('progressive_carries', 0),
                    'carries_into_final_third': row.get('carries_into_final_third', 0),
                    'carries_into_pen_area': row.get('carries_into_pen_area', 0),
                    'miscontrols': row.get('miscontrols', 0),
                    'times_dispossessed': row.get('times_dispossessed', 0),
                    'passes_received': row.get('passes_received', 0),
                    'progressive_passes_received': row.get('progressive_passes_received', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not poss_data:
        print("   x no possession data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(poss_data)
    save_formatted_table(result, "possession")
    return result
