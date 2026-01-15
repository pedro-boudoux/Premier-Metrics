"""
Goalkeeping tables formatter (regular and advanced).
"""
import pandas as pd
from .helpers import (
    GOALKEEPING_COLUMNS, ADVANCED_GOALKEEPING_COLUMNS,
    get_team_from_filename, fix_age, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_goalkeeping_table():
    """Create the basic goalkeeping stats table."""
    print("[FORMAT] Creating goalkeeping table...")
    
    gk_data = []
    gk_files = load_team_csvs("goalkeeping")
    
    for csv_file in gk_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=GOALKEEPING_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                gk_data.append({
                    'player_name': player,
                    'team': team_name,
                    'goals_against': row.get('goals_against', 0),
                    'goals_against_per_90': row.get('goals_against_per_90', 0),
                    'shots_on_target_against': row.get('shots_on_target_against', 0),
                    'saves': row.get('saves', 0),
                    'save_percent': row.get('save_percent', ''),
                    'wins': row.get('wins', 0),
                    'draws': row.get('draws', 0),
                    'losses': row.get('losses', 0),
                    'clean_sheets': row.get('clean_sheets', 0),
                    'clean_sheet_percent': row.get('clean_sheet_percent', ''),
                    'pk_attempted': row.get('pk_attempted', 0),
                    'pk_allowed': row.get('pk_allowed', 0),
                    'pk_saved': row.get('pk_saved', 0),
                    'pk_missed': row.get('pk_missed', 0),
                    'pk_save_percent': row.get('pk_save_percent', ''),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not gk_data:
        print("   x no goalkeeping data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(gk_data)
    save_formatted_table(result, "goalkeeping")
    return result


def create_advanced_goalkeeping_table():
    """Create the advanced goalkeeping stats table."""
    print("[FORMAT] Creating advanced goalkeeping table...")
    
    gk_data = []
    gk_files = load_team_csvs("advanced_goalkeeping")
    
    for csv_file in gk_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=ADVANCED_GOALKEEPING_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                gk_data.append({
                    'player_name': player,
                    'team': team_name,
                    'fk_goals_against': row.get('fk_goals_against', 0),
                    'corner_goals_against': row.get('corner_goals_against', 0),
                    'ogs_against_gk': row.get('ogs_against_gk', 0),
                    'post_shot_xg': row.get('post_shot_xg', 0),
                    'post_shot_xg_per_shot_on_target': row.get('post_shot_xg_per_shot_on_target', ''),
                    'post_shot_xg_goals_allowed_diff': row.get('post_shot_xg_goals_allowed_diff', 0),
                    'post_shot_xg_goals_allowed_p90_diff': row.get('post_shot_xg_goals_allowed_p90_diff', 0),
                    'launched_passes_completed': row.get('launched_passes_completed', 0),
                    'launched_passes_attempted': row.get('launched_passes_attempted', 0),
                    'pass_completion_percent': row.get('pass_completion_percent', ''),
                    'passes_attempted_non_goal_kick': row.get('passes_attempted_non_goal_kick', 0),
                    'throws_attempted': row.get('throws_attempted', 0),
                    'non_goal_kick_launch_percent': row.get('non_goal_kick_launch_percent', ''),
                    'non_goal_kick_avg_pass_length': row.get('non_goal_kick_avg_pass_length', ''),
                    'goal_kicks_attempted': row.get('goal_kicks_attempted', 0),
                    'launched_goal_kick_percentage': row.get('launched_goal_kick_percentage', ''),
                    'avg_goal_kick_length': row.get('avg_goal_kick_length', ''),
                    'crosses_faced': row.get('crosses_faced', 0),
                    'crosses_stopped': row.get('crosses_stopped', 0),
                    'crosses_stopped_percent': row.get('crosses_stopped_percent', ''),
                    'defensive_actions_outside_pen_area': row.get('defensive_actions_outside_pen_area', 0),
                    'defensive_actions_outside_pen_area_per_ninety': row.get('defensive_actions_outside_pen_area_per_ninety', 0),
                    'avg_distance_of_defensive_actions': row.get('avg_distance_of_defensive_actions', ''),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not gk_data:
        print("   x no advanced goalkeeping data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(gk_data)
    save_formatted_table(result, "advanced_goalkeeping")
    return result
