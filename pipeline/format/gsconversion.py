"""
Goal and shot creation table formatter.
"""
import pandas as pd
from .helpers import (
    GCA_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_goal_and_shot_conversion_table():
    """Create the goal and shot creation stats table."""
    print("[FORMAT] Creating goal and shot conversion table...")
    
    gca_data = []
    gca_files = load_team_csvs("goal_and_shot_creation")
    
    for csv_file in gca_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=GCA_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                gca_data.append({
                    'player_name': player,
                    'team': team_name,
                    'shot_creating_actions': row.get('shot_creating_actions', 0),
                    'shot_creating_actions_per_90': row.get('shot_creating_actions_per_90', 0),
                    'live_passes_sca': row.get('live_passes_sca', 0),
                    'dead_passes_sca': row.get('dead_passes_sca', 0),
                    'take_ons_sca': row.get('take_ons_sca', 0),
                    'shots_sca': row.get('shots_sca', 0),
                    'fouls_drawn_sca': row.get('fouls_drawn_sca', 0),
                    'def_sca': row.get('def_sca', 0),
                    'goal_creating_actions': row.get('goal_creating_actions', 0),
                    'gca_per_ninety': row.get('gca_per_ninety', 0),
                    'live_passes_gca': row.get('live_passes_gca', 0),
                    'dead_passes_gca': row.get('dead_passes_gca', 0),
                    'take_ons_gca': row.get('take_ons_gca', 0),
                    'shots_gca': row.get('shots_gca', 0),
                    'fouls_drawn_gca': row.get('fouls_drawn_gca', 0),
                    'def_gca': row.get('def_gca', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not gca_data:
        print("   x no goal/shot creation data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(gca_data)
    save_formatted_table(result, "goal_and_shot_conversion")
    return result
