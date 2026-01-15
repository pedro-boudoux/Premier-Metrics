"""
Misc stats table formatter.
"""
import pandas as pd
from .helpers import (
    MISCSTATS_COLUMNS,
    get_team_from_filename, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_misc_stats_table():
    """Create the miscellaneous stats table."""
    print("[FORMAT] Creating misc stats table...")
    
    misc_data = []
    misc_files = load_team_csvs("miscstats")
    
    for csv_file in misc_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=MISCSTATS_COLUMNS)
            
            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue
                
                player = str(row.get('player', '')).strip()
                
                misc_data.append({
                    'player_name': player,
                    'team': team_name,
                    'yellow_cards': row.get('yellow_cards', 0),
                    'red_cards': row.get('red_cards', 0),
                    'second_yellow_cards': row.get('second_yellow_cards', 0),
                    'fouls_commited': row.get('fouls_commited', 0),
                    'fouls_drawn': row.get('fouls_drawn', 0),
                    'offsides': row.get('offsides', 0),
                    'pk_won': row.get('pk_won', 0),
                    'pk_conceded': row.get('pk_conceded', 0),
                    'own_goals': row.get('own_goals', 0),
                    'ball_recoveries': row.get('ball_recoveries', 0),
                    'aerial_duels_won': row.get('aerial_duels_won', 0),
                    'aerial_duels_lost': row.get('aerial_duels_lost', 0),
                    'aerial_duels_won_percent': row.get('aerial_duels_won_percent', ''),
                })
                
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not misc_data:
        print("   x no misc stats data found")
        return pd.DataFrame()
    
    result = pd.DataFrame(misc_data)
    save_formatted_table(result, "misc_stats")
    return result
