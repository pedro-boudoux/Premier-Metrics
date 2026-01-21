"""
Final Formatting Functions
Transform raw data into production-ready formatted tables
"""
import pandas as pd
from pathlib import Path


RAW_DIR = Path(__file__).resolve().parent.parent / 'data' / 'raw'
FORMATTED_DIR = Path(__file__).resolve().parent.parent / 'data' / 'formatted'
FORMATTED_DIR.mkdir(parents=True, exist_ok=True)


def get_matched_names_map():
    """
    Load the name mappings from the matched defense file
    Returns dict: {understat_name: fotmob_name}
    Returns empty dict if file doesn't exist
    """
    matched_defense_path = RAW_DIR / 'fotmob_defense_season_matched.csv'
    
    if not matched_defense_path.exists():
        print("  WARNING: No matched defense file found. Using empty name mappings.")
        return {}
    
    matched_defense = pd.read_csv(matched_defense_path)
    
    # Create mapping: understat_name -> fotmob_name (for matched players)
    mappings = {}
    for _, row in matched_defense.iterrows():
        if pd.notna(row['matched_name']) and row['match_method'] != 'unmatched':
            mappings[row['matched_name']] = row['name']
    
    return mappings


def split_name(full_name):
    """
    Split a name into first and last name
    Handles multi-part names by taking last word as last name
    """
    if pd.isna(full_name) or not full_name:
        return '', ''
    
    parts = full_name.strip().split()
    
    if len(parts) == 1:
        return parts[0], ''
    elif len(parts) == 2:
        return parts[0], parts[1]
    else:
        # First name is first part, last name is last part
        return parts[0], parts[-1]


def format_players():
    """
    Create players.csv with FotMob names for mapped players only.
    Falls back to Understat names if no FotMob matching available.
    
    Output columns:
    - first_name
    - last_name  
    - team
    - positions (list as string)
    - matches
    - minutes
    - yellow_cards
    - red_cards
    """
    print("="*60)
    print("FORMAT_PLAYERS()")
    print("="*60)
    
    # Load understat players
    understat_df = pd.read_csv(RAW_DIR / 'understat_players.csv')
    
    # Get matched FotMob names
    name_mappings = get_matched_names_map()
    
    if name_mappings:
        # Filter to only matched players
        matched_players = understat_df[understat_df['player'].isin(name_mappings.keys())].copy()
        print(f"Found {len(understat_df)} total players in Understat")
        print(f"Matched players: {len(matched_players)}")
        
        # Add FotMob name column
        matched_players['fotmob_name'] = matched_players['player'].map(name_mappings)
    else:
        # No FotMob data available - use Understat names directly
        print("  No FotMob name mappings available. Using Understat names.")
        matched_players = understat_df.copy()
        matched_players['fotmob_name'] = matched_players['player']
        print(f"Using all {len(matched_players)} Understat players")
    
    # Split name into first and last
    matched_players['first_name'] = matched_players['fotmob_name'].apply(lambda x: split_name(x)[0])
    matched_players['last_name'] = matched_players['fotmob_name'].apply(lambda x: split_name(x)[1])
    
    # Split position into list
    matched_players['positions'] = matched_players['position'].apply(
        lambda x: ','.join(x.split()) if pd.notna(x) else ''
    )
    
    # Select and rename columns
    output_df = matched_players[[
        'first_name', 'last_name', 'team', 'positions',
        'matches', 'minutes', 'yellow_cards', 'red_cards'
    ]].copy()
    
    # Save
    output_path = FORMATTED_DIR / 'players.csv'
    output_df.to_csv(output_path, index=False)
    
    print(f"✓ Saved {len(output_df)} players to: {output_path}")
    print(output_df.head(10))
    
    return output_df


def format_defensive():
    """
    Create defensive.csv with FotMob names for matched players only.
    Returns None if no FotMob defensive data available.
    
    Output columns:
    - name (FotMob)
    - tackles_won
    - interceptions
    - duels_won
    """
    print("\n" + "="*60)
    print("FORMAT_DEFENSIVE()")
    print("="*60)
    
    matched_defense_path = RAW_DIR / 'fotmob_defense_season_matched.csv'
    
    if not matched_defense_path.exists():
        print("  WARNING: No FotMob defense data available. Skipping defensive formatting.")
        return None
    
    # Load matched defensive data
    defense_df = pd.read_csv(matched_defense_path)
    
    # Filter to only matched players
    matched_defense = defense_df[defense_df['match_method'] != 'unmatched'].copy()
    
    print(f"Found {len(defense_df)} players in FotMob defense data")
    print(f"Matched players: {len(matched_defense)}")
    
    # Select columns
    output_df = matched_defense[[
        'name', 'tackles_won', 'interceptions', 'duels_won'
    ]].copy()
    
    # Save
    output_path = FORMATTED_DIR / 'defensive.csv'
    output_df.to_csv(output_path, index=False)
    
    print(f"✓ Saved {len(output_df)} players to: {output_path}")
    print(output_df.head(10))
    
    return output_df


def format_offensive():
    """
    Create offensive.csv with FotMob names for mapped players only.
    Falls back to Understat names if no FotMob matching available.
    
    Output columns:
    - name (FotMob or Understat)
    - goals
    - shots
    - xg
    - np_goals
    - np_xg
    """
    print("\n" + "="*60)
    print("FORMAT_OFFENSIVE()")
    print("="*60)
    
    # Load understat offensive data
    offensive_df = pd.read_csv(RAW_DIR / 'understat_offensive.csv')
    
    # Get matched FotMob names
    name_mappings = get_matched_names_map()
    
    if name_mappings:
        # Filter to only matched players
        matched_offensive = offensive_df[offensive_df['player'].isin(name_mappings.keys())].copy()
        print(f"Found {len(offensive_df)} players in Understat offensive data")
        print(f"Matched players: {len(matched_offensive)}")
        
        # Add FotMob name column
        matched_offensive['name'] = matched_offensive['player'].map(name_mappings)
    else:
        # No FotMob data available - use Understat names directly
        print("  No FotMob name mappings available. Using Understat names.")
        matched_offensive = offensive_df.copy()
        matched_offensive['name'] = matched_offensive['player']
        print(f"Using all {len(matched_offensive)} Understat players")
    
    # Select columns
    output_df = matched_offensive[[
        'name', 'goals', 'shots', 'xg', 'np_goals', 'np_xg'
    ]].copy()
    
    # Save
    output_path = FORMATTED_DIR / 'offensive.csv'
    output_df.to_csv(output_path, index=False)
    
    print(f"✓ Saved {len(output_df)} players to: {output_path}")
    print(output_df.head(10))
    
    return output_df


def format_keepers():
    """
    Create keepers.csv with FotMob names for matched players only.
    Returns None if no FotMob keeper data available.
    
    Output columns:
    - name
    - saves
    - goals_conceded
    - punches
    - high_claims
    - recoveries
    - touches
    - passes_accurate
    - long_balls_accurate
    - goals_prevented
    - xgot_faced
    - clean_sheet
    """
    print("\n" + "="*60)
    print("FORMAT_KEEPERS()")
    print("="*60)
    
    matched_keepers_path = RAW_DIR / 'fotmob_keepers_season_matched.csv'
    
    if not matched_keepers_path.exists():
        print("  WARNING: No FotMob keeper data available. Skipping keeper formatting.")
        return None
    
    # Load matched keepers data
    keepers_df = pd.read_csv(matched_keepers_path)
    
    # Filter to only matched players
    matched_keepers = keepers_df[keepers_df['match_method'] != 'unmatched'].copy()
    
    print(f"Found {len(keepers_df)} goalkeepers in FotMob data")
    print(f"Matched players: {len(matched_keepers)}")
    
    # Select columns
    output_df = matched_keepers[[
        'name', 'saves', 'goals_conceded', 'punches', 'high_claims',
        'recoveries', 'touches', 'passes_accurate', 'long_balls_accurate',
        'goals_prevented', 'xgot_faced', 'clean_sheet'
    ]].copy()
    
    # Save
    output_path = FORMATTED_DIR / 'keepers.csv'
    output_df.to_csv(output_path, index=False)
    
    print(f"✓ Saved {len(output_df)} goalkeepers to: {output_path}")
    print(output_df.head(10))
    
    return output_df


def format_all():
    """
    Run all formatting functions and create all output files
    """
    print("\n" + "="*80)
    print("FORMATTING ALL DATA FOR PRODUCTION")
    print("="*80 + "\n")
    
    format_players()
    format_defensive()
    format_offensive()
    format_keepers()
    
    print("\n" + "="*80)
    print("FORMATTING COMPLETE!")
    print("="*80)
    print(f"\nOutput files saved to: {FORMATTED_DIR}")
    print("  - players.csv")
    print("  - defensive.csv")
    print("  - offensive.csv")
    print("  - keepers.csv")


if __name__ == "__main__":
    format_all()
