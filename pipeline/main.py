import requests
import soccerdata as sd
from pathlib import Path  
import pandas as pd
import os
import time
import json

# ========================================
# CONFIG
# ========================================
# makes data/raw
SCRIPT_DIR = Path(__file__).resolve().parent
RAW_DIR = SCRIPT_DIR / 'data' / 'raw'
RAW_DIR.mkdir(parents=True, exist_ok=True)
FORMATTED_DIR = SCRIPT_DIR / 'data' / 'formatted'
FORMATTED_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = Path('app/pipeline/data')
path_to_chrome = os.getenv("CHROME_PBT_PATH")

# season config
# TODO: Add logic to calculate what the current season is from current date!
LEAGUE = "ENG-Premier League"
SEASON = "2025"

# ========================================
# GET UNDERSTAT METRICS (player (for card) + offensive + passing)
# ========================================
def get_understat_metrics():
    """
    fetches the master understat table and splits it into 
    'offensive' and 'passing' 
    """
    print(f"[{LEAGUE}] fetching understat data...")
    try:
        
       ud = sd.Understat(leagues="ENG-Premier League", seasons="2025",data_dir=RAW_DIR)
       df = ud.read_player_season_stats()
       df = df.reset_index()

       p_cols = [
            'player', 'team', 'position', 'matches', 'minutes', 'yellow_cards', 'red_cards'
       ]

       off_cols = [
           'player', 'team', 'position',  
       'goals', 'shots', 'xg', 'np_goals', 'np_xg', 
       ]

       pass_cols = [
       'player', 'team', 'position',  
       'assists', 'xa', 'key_passes', 'xg_chain', 'xg_buildup'
       ]

       df_off = df[off_cols].copy()
       df_off.to_csv(RAW_DIR / 'understat_offensive.csv', index=False)
       print(f"> saved offensive stats ({len(df_off)} rows)")

       df_pass = df[pass_cols].copy()
       df_pass.to_csv(RAW_DIR / 'understat_passing.csv', index=False)
       print(f"> saved passing stats ({len(df_pass)} rows)")

       df_p = df[p_cols].copy()
       df_p.to_csv(RAW_DIR / 'understat_players.csv', index=False)
       print(f"> saved players table ({len(df_p)} rows)")

    except Exception as e:
        print(f"!!!! understat failed: {e}")

# ========================================
# GET DEFENSIVE METRICS 
# ========================================
# There is no reliable source for good defensive data other than FBref (who has me banned atp)
# So we use fotmob to collect individual player match stats then we aggregate it
def get_defensive_stats():
    print("--- STARTING FOTMOB HARVESTER (FINAL) ---")
    
    # FIND MATCHES - Direct API call (soccerdata's cookie server is unreliable)
    print("1. Fetching schedule from FotMob API...")
    
    # Premier League ID on FotMob is 47
    league_url = "https://www.fotmob.com/api/leagues?id=47"
    r = requests.get(league_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    league_data = r.json()
    
    # Extract finished match IDs from the league data
    game_ids = []
    matches = league_data.get('fixtures', {}).get('allMatches', [])
    for match in matches:
        status = match.get('status', {})
        # Check if match is finished
        if status.get('finished', False):
            if match.get('id'):
                game_ids.append(match.get('id'))
    
    print(f" > Found {len(game_ids)} matches to process.")
    
    all_player_stats = []

    # GO THROUGH EVERY MATCH TO COLLECT THE PLAYER STATS
    for i, game_id in enumerate(game_ids):
        try:
            # send request for match stats using fotmob api
            url = f"https://www.fotmob.com/api/matchDetails?matchId={game_id}"
            r = requests.get(url, timeout=5)
            data = r.json()
            
            # Safe navigation to the playerStats dictionary
            content = data.get('content', {})
            player_stats_root = content.get('playerStats')
            
            if not player_stats_root:
                continue

            # now we iterate over each player in the match
            # note: sometimes root keys are team IDs, sometimes mixed. 
            # We iterate values() to be safe if it's a dict of players.
            
            # FLATTEN THE PLAYERS LIST
            players_to_process = []
            
            if isinstance(player_stats_root, dict):
                first_key = next(iter(player_stats_root))
                first_val = player_stats_root[first_key]
                
                # Format A: Keys are Player IDs (Direct list)
                if 'name' in first_val and 'stats' in first_val:
                    players_to_process = player_stats_root.values()
                    
                # Format B: Keys are Team IDs (Grouped)
                elif isinstance(first_val, list): # Team -> List of players
                    for team_id, p_list in player_stats_root.items():
                        players_to_process.extend(p_list)
            
            # 3. PARSE EACH PLAYER
            for p in players_to_process:
                p_name = p.get('name')
                p_id = p.get('id')
                p_team = p.get('teamName') 
                
                stats_list = p.get('stats', [])
                
                # Init each player's stats row
                row = {
                    'game_id': game_id,
                    'player_id': p_id,
                    'name': p_name,
                    'team': p_team,
                    'tackles_won': 0,
                    'interceptions': 0,
                    'duels_won': 0,
                    'was_fouled': 0,
                    'fouls_committed': 0,
                    'minutes': 0,
                    'rating': 0.0 # TODO: get rid of this or move to a different
                }

                # iterate through the categories ("Top stats", "Defense", "Duels")
                for category in stats_list:
                    # Inside a category, 'stats' is a DICT of metrics
                    metrics = category.get('stats', {})
                    
                    # Helper to safely extract value
                    def get_val(key):
                        if key in metrics:
                            # Structure: "Tackles": { "stat": { "value": 1 } }
                            return metrics[key].get('stat', {}).get('value', 0)
                        return 0

                    # Extract what we find in this category
                    # We use += because metrics might be split (rare but possible)
                    row['tackles_won'] += int(get_val('Tackles'))
                    row['interceptions'] += int(get_val('Interceptions'))
                    row['duels_won'] += int(get_val('Duels won'))
                    row['was_fouled'] += int(get_val('Was fouled'))
                    row['fouls_committed'] += int(get_val('Fouls committed'))
                    
                    # Minutes usually in "Top stats"
                    mins = get_val('Minutes played')
                    if mins: row['minutes'] = int(mins)
                    
                    # Rating usually in "Top stats"
                    rating = get_val('FotMob rating')
                    if rating: row['rating'] = float(rating)

                all_player_stats.append(row)
                
        except Exception as e:
            # print(f"x Match {game_id} error: {e}")
            pass

        if i % 20 == 0:
            print(f" > Processed {i}/{len(game_ids)} matches...")
            time.sleep(0.1)

    # 4. SAVE
    print("Aggregating season data...")
    df = pd.DataFrame(all_player_stats)
    
    if df.empty:
        print("!!!! STILL NO DATA. The format might vary per match.")
        return

    # Sum up the season totals
    season_df = df.groupby(['player_id', 'name', 'team']).sum(numeric_only=True).reset_index()
    
    # Save
    out_path = RAW_DIR / 'fotmob_defense_season_final.csv'
    season_df.to_csv(out_path, index=False)
    print(f"SUCCESS. Saved defensive stats to: {out_path}")
    print(season_df.head())

def get_keeper_stats():
    print("--- STARTING FOTMOB KEEPER HARVESTER ---")
    
    # 1. GET SCHEDULE - Direct API call (soccerdata's cookie server is unreliable)
    print("1. Fetching schedule from FotMob API...")
    
    # Premier League ID on FotMob is 47
    league_url = "https://www.fotmob.com/api/leagues?id=47"
    r = requests.get(league_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    league_data = r.json()
    
    # Extract finished match IDs from the league data
    game_ids = []
    matches = league_data.get('fixtures', {}).get('allMatches', [])
    for match in matches:
        status = match.get('status', {})
        if status.get('finished', False):
            if match.get('id'):
                game_ids.append(match.get('id'))
    
    print(f" > Found {len(game_ids)} matches to process.")
    
    all_keepers = []

    # 2. LOOP MATCHES
    for i, game_id in enumerate(game_ids):
        try:
            url = f"https://www.fotmob.com/api/matchDetails?matchId={game_id}"
            r = requests.get(url, timeout=5)
            data = r.json()
            
            content = data.get('content', {})
            player_stats_root = content.get('playerStats')
            
            if not player_stats_root:
                continue

            # Flatten the players list (handling the structure quirks we found earlier)
            players_to_process = []
            if isinstance(player_stats_root, dict):
                first_val = player_stats_root[next(iter(player_stats_root))]
                if 'name' in first_val: # Dict of players
                    players_to_process = player_stats_root.values()
                elif isinstance(first_val, list): # Dict of Teams -> List of Players
                    for team_id, p_list in player_stats_root.items():
                        players_to_process.extend(p_list)

            # 3. PARSE KEEPERS ONLY
            for p in players_to_process:
                # FotMob usually flags GKs, or we check if they have specific stats
                # Note: 'isGoalkeeper' might be a boolean key in 'p'
                if not p.get('isGoalkeeper', False):
                    continue
                    
                stats_list = p.get('stats', [])
                
                row = {
                    'game_id': game_id,
                    'player_id': p.get('id'),
                    'name': p.get('name'),
                    'team': p.get('teamName'),
                    'minutes': 0,
                    'rating': 0.0,
                    # GK Specifics
                    'saves': 0,
                    'goals_conceded': 0,
                    'xgot_faced': 0.0, # Expected Goals on Target Faced (Post-Shot xG)
                    'goals_prevented': 0.0,
                    'punches': 0,
                    'high_claims': 0,
                    'recoveries': 0,
                    'touches': 0,
                    'passes_accurate': 0,
                    'long_balls_accurate': 0,
                    'clean_sheet': 0 
                }

                # Helper to extract values by their English title
                def get_val(key_title):
                    for category in stats_list:
                        metrics = category.get('stats', {})
                        if key_title in metrics:
                            val = metrics[key_title].get('stat', {}).get('value', 0)
                            return val
                    return 0

                # --- FILL DATA ---
                row['saves'] = int(get_val('Saves'))
                row['goals_conceded'] = int(get_val('Goals conceded'))
                row['punches'] = int(get_val('Punches'))
                row['high_claims'] = int(get_val('High claims'))
                row['recoveries'] = int(get_val('Recoveries'))
                row['touches'] = int(get_val('Touches'))
                
                # Advanced stats (sometimes labeled differently)
                row['goals_prevented'] = float(get_val('Goals prevented') or 0.0)
                # Sometimes xGoT is listed as "Expected goals on target"
                row['xgot_faced'] = float(get_val('Expected goals on target (xGOT)') or 0.0)
                
                # Distribution
                row['passes_accurate'] = int(get_val('Accurate passes'))
                row['long_balls_accurate'] = int(get_val('Accurate long balls'))
                
                # Basics
                row['minutes'] = int(get_val('Minutes played'))
                row['rating'] = float(get_val('FotMob rating') or 0.0)
                
                # Manual Clean Sheet Logic (Safest)
                if row['goals_conceded'] == 0 and row['minutes'] > 80:
                    row['clean_sheet'] = 1

                all_keepers.append(row)

        except Exception as e:
            pass

        if i % 20 == 0:
            print(f" > Processed {i}/{len(game_ids)} matches...")
            time.sleep(0.1)

    # 4. SAVE
    print("Aggregating keeper season data...")
    if not all_keepers:
        print("!!!! NO KEEPER DATA FOUND.")
        return

    df = pd.DataFrame(all_keepers)
    
    # Sum totals (average rating separately)
    cols_to_sum = [
        'saves', 'goals_conceded', 'punches', 'high_claims', 
        'recoveries', 'touches', 'passes_accurate', 'long_balls_accurate', 
        'goals_prevented', 'xgot_faced', 'minutes', 'clean_sheet'
    ]
    
    season_df = df.groupby(['player_id', 'name', 'team'])[cols_to_sum].sum().reset_index()
    
    # Calculate Average Rating
    avg_rating = df.groupby(['player_id'])['rating'].mean().reset_index(name='avg_rating')
    season_df = season_df.merge(avg_rating, on='player_id')

    out_path = RAW_DIR / 'fotmob_keepers_season.csv'
    season_df.to_csv(out_path, index=False)
    print(f"SUCCESS. Saved keeper stats to: {out_path}")
    print(season_df[['name', 'saves', 'clean_sheet', 'goals_prevented']].head())

def match_player_names():
    """
    Fuzzy match player names between Understat and FotMob datasets
    Uses the name_matcher module to create matched versions of the FotMob data
    """
    from format.name_matcher import match_and_save
    
    # Manual mappings for known mismatches between FotMob and Understat
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
    
    print("="*60)
    print("RUNNING FUZZY NAME MATCHING")
    print("="*60)
    match_and_save(RAW_DIR, threshold=85, manual_mappings=manual_mappings, dry_run=False)

def format_data():
    """
    Format all data for production using FotMob names for matched players
    """
    from format.format_functions import format_all
    
    print("="*60)
    print("FORMATTING DATA FOR PRODUCTION")
    print("="*60)
    format_all()

def get_table():
    print("--- STARTING FOTMOB LEAGUE TABLE SCRAPER ---")
    
    print("Fetching league table from FotMob API...")
    
    league_url = "https://www.fotmob.com/api/leagues?id=47"
    r = requests.get(league_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    league_data = r.json()
    
    table_data = []
    
    try:
        table_list = league_data.get('table', [])
        if table_list and len(table_list) > 0:
            all_teams = table_list[0].get('data', {}).get('table', {}).get('all', [])
        else:
            all_teams = []
        
        for team in all_teams:
            scores_str = team.get('scoresStr', '0-0')
            if '-' in scores_str:
                parts = scores_str.split('-')
                gf = int(parts[0])
                ga = int(parts[1])
            else:
                gf = 0
                ga = 0
            
            row = {
                'team': team.get('name'),
                'MP': team.get('played', 0),
                'W': team.get('wins', 0),
                'D': team.get('draws', 0),
                'L': team.get('losses', 0),
                'GF': gf,
                'GA': ga,
                'GD': team.get('goalConDiff', 0),
                'Pts': team.get('pts', 0)
            }
            table_data.append(row)
        
        df = pd.DataFrame(table_data)
        
        out_path = RAW_DIR / 'fotmob_league_table.csv'
        df.to_csv(out_path, index=False)
        print(f"Saved league table to: {out_path}")
        print(df.head().to_string())
        
    except Exception as e:
        print(f"!!!! League table scraping failed: {e}")
        return

def push_to_database():
    """
    Push formatted data to Supabase database
    """
    import push_to_db
    
    print("="*60)
    print("PUSHING DATA TO SUPABASE")
    print("="*60)
    push_to_db.push_all_tables()


if __name__=="__main__":

    print("="*80)
    print("PREMIER LEAGUE DATA PIPELINE")
    print("="*80)
    
    # Step 1: Scrape data from sources
    print("\n" + "="*80)
    print("STEP 1: SCRAPING DATA FROM SOURCES")
    print("="*80)
    get_understat_metrics()
    get_defensive_stats()
    get_keeper_stats()
    
    # Step 2: Match player names between sources (FUZZY MATCHING)
    print("\n" + "="*80)
    print("STEP 2: MATCHING PLAYER NAMES")
    print("="*80)
    match_player_names()
    
    # Step 3: Format data for production (uses FotMob names for matched players)
    print("\n" + "="*80)
    print("STEP 3: FORMATTING DATA FOR PRODUCTION")
    print("="*80)
    format_data()
    
    print("STEP 4: GETTING PREMIER LEAGUE TABLE")
    get_table()

    # Step 4: Push to Supabase database
    print("\n" + "="*80)
    print("STEP 5: PUSHING TO SUPABASE DATABASE")
    print("="*80)
    push_to_database()
    
    print("\n" + "="*80)
    print("PIPELINE COMPLETE!")
    print("="*80)
    print("\nOutput files:")
    print("  - pipeline/data/formatted/players.csv")
    print("  - pipeline/data/formatted/defensive.csv")
    print("  - pipeline/data/formatted/offensive.csv")
    print("  - pipeline/data/formatted/keepers.csv")
    print("\nDatabase tables updated:")
    print("  - players")
    print("  - defensive")
    print("  - offensive")
    print("  - keepers")
