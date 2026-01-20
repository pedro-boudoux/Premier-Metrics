"""
Name Matcher Module
Fuzzy matches player names between Understat and FotMob datasets
"""
import pandas as pd
from rapidfuzz import fuzz, process
from pathlib import Path


def normalize_name(name):
    """
    Normalize a name for better fuzzy matching:
    - Convert to lowercase
    - Remove extra whitespace
    - Handle common accents/special characters
    """
    if pd.isna(name):
        return ""
    
    name = str(name).strip().lower()
    
    # Common replacements for better matching
    replacements = {
        'ø': 'o',
        'ö': 'o',
        'ü': 'u',
        'ä': 'a',
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'á': 'a',
        'à': 'a',
        'â': 'a',
        'í': 'i',
        'ì': 'i',
        'ó': 'o',
        'ò': 'o',
        'ú': 'u',
        'ù': 'u',
        'ñ': 'n',
        'ç': 'c',
    }
    
    for old, new in replacements.items():
        name = name.replace(old, new)
    
    return name


def fuzzy_match_names(understat_df, fotmob_df, threshold=85, manual_mappings=None):
    """
    Fuzzy match FotMob player names to Understat player names
    
    Parameters:
    -----------
    understat_df : pd.DataFrame
        DataFrame with 'player' column from Understat
    fotmob_df : pd.DataFrame
        DataFrame with 'name' column from FotMob
    threshold : int (default=85)
        Minimum similarity score (0-100) to consider a match
    manual_mappings : dict (optional)
        Dictionary of manual name mappings {fotmob_name: understat_name}
    
    Returns:
    --------
    pd.DataFrame : FotMob dataframe with added columns:
        - 'matched_name': The matched Understat name
        - 'match_score': Similarity score (0-100)
        - 'match_method': 'exact', 'fuzzy', 'manual', or 'unmatched'
    """
    
    # Initialize manual mappings if not provided
    if manual_mappings is None:
        manual_mappings = {}
    
    # Create a copy to avoid modifying original
    result_df = fotmob_df.copy()
    
    # Get unique names from both datasets
    understat_names = understat_df['player'].unique().tolist()
    fotmob_names = result_df['name'].unique().tolist()
    
    # Create mapping dictionaries
    name_map = {}  # fotmob_name -> understat_name
    score_map = {}  # fotmob_name -> match_score
    method_map = {}  # fotmob_name -> match_method
    
    print(f"Matching {len(fotmob_names)} FotMob names to {len(understat_names)} Understat names...")
    print(f"Using threshold: {threshold}")
    
    # Track stats
    exact_matches = 0
    fuzzy_matches = 0
    manual_matches = 0
    unmatched = 0
    
    for fotmob_name in fotmob_names:
        matched = False
        
        # 1. Check manual mappings first
        if fotmob_name in manual_mappings:
            name_map[fotmob_name] = manual_mappings[fotmob_name]
            score_map[fotmob_name] = 100
            method_map[fotmob_name] = 'manual'
            manual_matches += 1
            matched = True
            continue
        
        # 2. Try exact match (case-insensitive)
        for understat_name in understat_names:
            if fotmob_name.lower() == understat_name.lower():
                name_map[fotmob_name] = understat_name
                score_map[fotmob_name] = 100
                method_map[fotmob_name] = 'exact'
                exact_matches += 1
                matched = True
                break
        
        if matched:
            continue
        
        # 3. Try fuzzy matching
        # Use token_sort_ratio which handles word order differences
        best_match = process.extractOne(
            fotmob_name,
            understat_names,
            scorer=fuzz.token_sort_ratio
        )
        
        if best_match and best_match[1] >= threshold:
            name_map[fotmob_name] = best_match[0]
            score_map[fotmob_name] = best_match[1]
            method_map[fotmob_name] = 'fuzzy'
            fuzzy_matches += 1
        else:
            # No match found
            name_map[fotmob_name] = None
            score_map[fotmob_name] = 0
            method_map[fotmob_name] = 'unmatched'
            unmatched += 1
    
    # Apply mappings to the dataframe
    result_df['matched_name'] = result_df['name'].map(name_map)
    result_df['match_score'] = result_df['name'].map(score_map)
    result_df['match_method'] = result_df['name'].map(method_map)
    
    # Print summary
    print("\n" + "="*60)
    print("MATCHING SUMMARY")
    print("="*60)
    print(f"Exact matches:  {exact_matches:>4}")
    print(f"Fuzzy matches:  {fuzzy_matches:>4}")
    print(f"Manual matches: {manual_matches:>4}")
    print(f"Unmatched:      {unmatched:>4}")
    print(f"Total:          {len(fotmob_names):>4}")
    print("="*60)
    
    # Show unmatched names
    if unmatched > 0:
        print("\nUNMATCHED NAMES (consider adding to manual_mappings):")
        print("-"*60)
        unmatched_names = result_df[result_df['match_method'] == 'unmatched'][['name', 'team']].drop_duplicates()
        for _, row in unmatched_names.iterrows():
            print(f"  '{row['name']}' ({row['team']})")
    
    # Show fuzzy matches for review (score < 95)
    uncertain_matches = result_df[
        (result_df['match_method'] == 'fuzzy') & 
        (result_df['match_score'] < 95)
    ][['name', 'matched_name', 'match_score', 'team']].drop_duplicates()
    
    if len(uncertain_matches) > 0:
        print("\nFUZZY MATCHES (score < 95) - Please review:")
        print("-"*60)
        for _, row in uncertain_matches.iterrows():
            print(f"  {row['name']:30} -> {row['matched_name']:30} (score: {row['match_score']:.1f}, team: {row['team']})")
    
    return result_df


def match_and_save(raw_dir, threshold=85, manual_mappings=None, dry_run=False):
    """
    Load data, perform matching, and save results
    
    Parameters:
    -----------
    raw_dir : Path
        Path to the raw data directory
    threshold : int
        Minimum similarity score for fuzzy matching
    manual_mappings : dict
        Manual name mappings
    dry_run : bool
        If True, don't save files, just show results
    """
    
    print("Loading data...")
    understat_df = pd.read_csv(raw_dir / 'understat_players.csv')
    fotmob_defense = pd.read_csv(raw_dir / 'fotmob_defense_season_final.csv')
    fotmob_keepers = pd.read_csv(raw_dir / 'fotmob_keepers_season.csv')
    
    print(f"  Understat players: {len(understat_df)}")
    print(f"  FotMob defense: {len(fotmob_defense)}")
    print(f"  FotMob keepers: {len(fotmob_keepers)}")
    
    # Match both FotMob datasets
    print("\n" + "="*60)
    print("MATCHING DEFENSIVE PLAYERS")
    print("="*60)
    matched_defense = fuzzy_match_names(understat_df, fotmob_defense, threshold, manual_mappings)
    
    print("\n" + "="*60)
    print("MATCHING GOALKEEPERS")
    print("="*60)
    matched_keepers = fuzzy_match_names(understat_df, fotmob_keepers, threshold, manual_mappings)
    
    if not dry_run:
        # Save matched datasets
        output_defense = raw_dir / 'fotmob_defense_season_matched.csv'
        output_keepers = raw_dir / 'fotmob_keepers_season_matched.csv'
        
        matched_defense.to_csv(output_defense, index=False)
        matched_keepers.to_csv(output_keepers, index=False)
        
        print(f"\n✓ Saved matched defense data to: {output_defense}")
        print(f"✓ Saved matched keepers data to: {output_keepers}")
        
        # Also create a mapping file for reference
        mapping_df = matched_defense[['name', 'matched_name', 'match_score', 'match_method']].drop_duplicates()
        mapping_file = raw_dir / 'name_mappings.csv'
        mapping_df.to_csv(mapping_file, index=False)
        print(f"✓ Saved name mappings reference to: {mapping_file}")
    else:
        print("\n[DRY RUN] No files saved.")
    
    return matched_defense, matched_keepers


if __name__ == "__main__":
    # Example usage with manual mappings
    from pathlib import Path
    
    SCRIPT_DIR = Path(__file__).resolve().parent.parent
    RAW_DIR = SCRIPT_DIR / 'data' / 'raw'
    
    # Manual mappings for known mismatches between FotMob and Understat
    # Format: {'FotMob Name': 'Understat Name'}
    manual_mappings = {
        # === GOALKEEPERS ===
        'Alisson Becker': 'Alisson',
        'Ederson': 'Ederson Moraes',
        'Andre Onana': 'André Onana',
        'Kepa Arrizabalaga': 'Kepa',
        
        # === COMMON ABBREVIATED NAMES ===
        'Amad': 'Amad Diallo',
        'Savinho': 'Savinho',
        'Andre': 'André',
        
        # === NAME VARIATIONS ===
        'Edward Nketiah': 'Eddie Nketiah',
        'Emile Smith Rowe': 'Emile Smith-Rowe',
        
        # === HIGH-MINUTE PLAYERS (500+ minutes) ===
        'Ezri Konsa': 'Ezri Konsa Ngoyo',
        'Florentino': 'Florentino Luís',
        'Malick Diouf': 'El Hadji Malick Diouf',
        'Kristoffer Vassbakk Ajer': 'Kristoffer Ajer',
        'Idrissa Gana Gueye': 'Idrissa Gueye',
        'Toti Gomes': 'Toti',
        'Rayan Cherki': 'Rayan Ait Nouri',
        'Destiny Udogie': 'Iyenoma Destiny Udogie',
        'Victor Nilsson Lindelöf': 'Victor Lindelöf',
        'Estevao': 'Estêvão',
        'Matty Cash': 'Matthew Cash',
        'Igor Thiago': 'Thiago',
        'Lesley Ugochukwu': 'Chimuanya Ugochukwu',
        'Daniel Burn': 'Dan Burn',
        'Alex Jimenez': 'Alejandro Jiménez',
    }
    
    # Run the matching with a threshold of 85
    # You can lower the threshold to 80 if you want more fuzzy matches
    # or raise it to 90 for stricter matching
    match_and_save(RAW_DIR, threshold=85, manual_mappings=manual_mappings, dry_run=False)
