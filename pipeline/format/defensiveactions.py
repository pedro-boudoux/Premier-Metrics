"""
Defensive actions table formatter.
"""
import pandas as pd
from .helpers import (
    DEFENSIVE_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_defensive_actions_table():
    """Create the defensive actions stats table."""
    print("[FORMAT] Creating defensive actions table...")
    
    def_data = []
    def_files = load_team_csvs("defensive_actions")
    
    for csv_file in def_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=DEFENSIVE_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                def_data.append({
                    'player_name': player,
                    'team': team_name,
                    'tackles': row.get('tackles', 0),
                    'tackles_won': row.get('tackles_won', 0),
                    'defensive_third_tackles': row.get('defensive_third_tackles', 0),
                    'middle_third_tackles': row.get('middle_third_tackles', 0),
                    'attacking_third_tackles': row.get('attacking_third_tackles', 0),
                    'dribblers_tackled': row.get('dribblers_tackled', 0),
                    'dribblers_challenged': row.get('dribblers_challenged', 0),
                    'dribblers_tackled_percent': row.get('dribblers_tackled_percent', ''),
                    'challenges_lost': row.get('challenges_lost', 0),
                    'blocks': row.get('blocks', 0),
                    'shots_blocked': row.get('shots_blocked', 0),
                    'passses_blocked': row.get('passses_blocked', 0),  # typo preserved
                    'interceptions': row.get('interceptions', 0),
                    'tackles_and_interceptions': row.get('tackles_and_interceptions', 0),
                    'clearances': row.get('clearances', 0),
                    'shot_leading_errors': row.get('shot_leading_errors', 0),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not def_data:
        print("   x no defensive actions data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(def_data)
    save_formatted_table(result, "defensive_actions")
    return result
