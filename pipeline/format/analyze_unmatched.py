"""
Analyze Unmatched Players
Shows statistics about unmatched players to help prioritize manual mappings
"""
import pandas as pd
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = SCRIPT_DIR / 'data' / 'raw'

def analyze_unmatched():
    """
    Analyze unmatched players to prioritize which ones need manual mapping
    """
    
    # Load matched data
    defense_df = pd.read_csv(RAW_DIR / 'fotmob_defense_season_matched.csv')
    keepers_df = pd.read_csv(RAW_DIR / 'fotmob_keepers_season_matched.csv')
    
    # Filter unmatched players
    unmatched_defense = defense_df[defense_df['match_method'] == 'unmatched'].copy()
    unmatched_keepers = keepers_df[keepers_df['match_method'] == 'unmatched'].copy()
    
    print("="*80)
    print("UNMATCHED PLAYERS ANALYSIS")
    print("="*80)
    
    # Defensive players with significant playing time
    print("\n" + "="*80)
    print("UNMATCHED DEFENSIVE PLAYERS (with 500+ minutes)")
    print("="*80)
    significant_defense = unmatched_defense[unmatched_defense['minutes'] >= 500].sort_values('minutes', ascending=False)
    
    if len(significant_defense) > 0:
        print(f"\nFound {len(significant_defense)} players with significant playing time:\n")
        for _, row in significant_defense.iterrows():
            print(f"  '{row['name']:40s} | {row['team']:30s} | {row['minutes']:4.0f} min | {row['tackles_won']:2.0f} tackles | {row['interceptions']:2.0f} ints")
        print("\n⚠ These players should be manually mapped!")
    else:
        print("\n✓ No defensive players with 500+ minutes are unmatched")
    
    # Goalkeepers with significant playing time
    print("\n" + "="*80)
    print("UNMATCHED GOALKEEPERS (with 500+ minutes)")
    print("="*80)
    significant_keepers = unmatched_keepers[unmatched_keepers['minutes'] >= 500].sort_values('minutes', ascending=False)
    
    if len(significant_keepers) > 0:
        print(f"\nFound {len(significant_keepers)} goalkeepers with significant playing time:\n")
        for _, row in significant_keepers.iterrows():
            print(f"  '{row['name']:40s} | {row['team']:30s} | {row['minutes']:4.0f} min | {row['saves']:3.0f} saves")
        print("\n⚠ These goalkeepers should be manually mapped!")
    else:
        print("\n✓ No goalkeepers with 500+ minutes are unmatched")
    
    # Summary stats
    print("\n" + "="*80)
    print("SUMMARY STATISTICS")
    print("="*80)
    
    total_defense = len(defense_df)
    matched_defense = len(defense_df[defense_df['match_method'] != 'unmatched'])
    total_keepers = len(keepers_df)
    matched_keepers = len(keepers_df[keepers_df['match_method'] != 'unmatched'])
    
    print(f"\nDefensive Players:")
    print(f"  Total:     {total_defense:4d}")
    print(f"  Matched:   {matched_defense:4d} ({matched_defense/total_defense*100:.1f}%)")
    print(f"  Unmatched: {len(unmatched_defense):4d} ({len(unmatched_defense)/total_defense*100:.1f}%)")
    
    print(f"\nGoalkeepers:")
    print(f"  Total:     {total_keepers:4d}")
    print(f"  Matched:   {matched_keepers:4d} ({matched_keepers/total_keepers*100:.1f}%)")
    print(f"  Unmatched: {len(unmatched_keepers):4d} ({len(unmatched_keepers)/total_keepers*100:.1f}%)")
    
    # Minutes distribution
    total_defense_minutes = defense_df['minutes'].sum()
    matched_defense_minutes = defense_df[defense_df['match_method'] != 'unmatched']['minutes'].sum()
    
    total_keeper_minutes = keepers_df['minutes'].sum()
    matched_keeper_minutes = keepers_df[keepers_df['match_method'] != 'unmatched']['minutes'].sum()
    
    print(f"\nMinutes Coverage:")
    print(f"  Defense:  {matched_defense_minutes/total_defense_minutes*100:.1f}% of total minutes matched")
    print(f"  Keepers:  {matched_keeper_minutes/total_keeper_minutes*100:.1f}% of total minutes matched")
    
    print("\n" + "="*80)


if __name__ == "__main__":
    analyze_unmatched()
