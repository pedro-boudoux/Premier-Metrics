"""
Pass types table formatter.
"""
import pandas as pd
from .helpers import (
    PASSTYPES_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_pass_types_table():
    """Create the pass types stats table."""
    print("[FORMAT] Creating pass types table...")
    
    pass_types_data = []
    pass_types_files = load_team_csvs("passtypes")
    
    for csv_file in pass_types_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=PASSTYPES_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                pass_types_data.append({
                    'player_name': player,
                    'team': team_name,
                    'live_ball_passes': row.get('live_ball_passes', 0),
                    'dead_ball_passes': row.get('dead_ball_passes', 0),
                    'free_kick_passes': row.get('free_kick_passes', 0),
                    'through_balls': row.get('through_balls', 0),
                    'switches': row.get('switches', 0),
                    'crosses': row.get('crosses', 0),
                    'throw_ins_taken': row.get('throw_ins_taken', 0),
                    'corners_taken': row.get('corners_taken', 0),
                    'inswinging_corners': row.get('inswinging_corners', 0),
                    'outswinging_corners': row.get('outswinging_corners', 0),
                    'straight_corners': row.get('straight_corners', 0),
                    'total_passes_completed': row.get('total_passes_completed', 0),
                    'passes_offside': row.get('passes_offside', 0),
                    'passes_blocked': row.get('passes_blocked', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not pass_types_data:
        print("   x no pass types data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(pass_types_data)
    save_formatted_table(result, "pass_types")
    return result
