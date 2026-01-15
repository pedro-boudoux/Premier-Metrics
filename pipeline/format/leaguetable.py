"""
League table formatter.
"""
import pandas as pd
from .helpers import RAW_TABLES_DIR, save_formatted_table


# Column mapping from fbref to database schema
LEAGUE_TABLE_COLUMNS = {
    "Rk": "rank",
    "Squad": "team",
    "MP": "matches_played",
    "W": "wins",
    "D": "draws",
    "L": "losses",
    "GF": "goals_for",
    "GA": "goals_against",
    "GD": "goal_difference",
    "Pts": "pts",
    "Pts/MP": "pts_per_match",
    "xG": "xg",
    "xGA": "xga",
    "xGD": "xgd",
    "xGD/90": "xgd_per_90",
    "Attendance": "attendance",
    "Top Team Scorer": "top_scorer",
    "Goalkeeper": "goalkeeper",
}


def create_league_table():
    """
    Create the formatted league table.
    
    Output schema matches:
    - rank, team, matches_played, wins, draws, losses, goals_for, goals_against,
    - goal_difference, pts, pts_per_match, xg, xga, xgd, xgd_per_90,
    - attendance, top_scorer, goalkeeper
    """
    print("[FORMAT] Creating league table...")
    
    csv_path = RAW_TABLES_DIR / "league_table.csv"
    
    if not csv_path.exists():
        print(f"   x league table not found at {csv_path}")
        return pd.DataFrame()
    
    try:
        df = pd.read_csv(csv_path)
        
        # Rename columns to match database schema
        df = df.rename(columns=LEAGUE_TABLE_COLUMNS)
        
        # Select only the columns we need (in order)
        output_columns = [
            'rank', 'team', 'matches_played', 'wins', 'draws', 'losses',
            'goals_for', 'goals_against', 'goal_difference', 'pts', 'pts_per_match',
            'xg', 'xga', 'xgd', 'xgd_per_90', 'attendance', 'top_scorer', 'goalkeeper'
        ]
        
        # Only include columns that exist
        available_cols = [col for col in output_columns if col in df.columns]
        df = df[available_cols]
        
        save_formatted_table(df, "league_table")
        return df
        
    except Exception as e:
        print(f"   x error processing league table: {e}")
        return pd.DataFrame()
