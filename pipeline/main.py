import os
import pandas as pd
from bs4 import BeautifulSoup, Comment
import time
from pathlib import Path
import re
from io import StringIO
from curl_cffi import requests
from db_refresh import gw_update_db

# INSTRUCTIONS
# run with python main.py 2>&1 | head -30


# === CONFIGURATION ===
FBREF_BASE_URL = "https://fbref.com"
PL_TABLE_URL = "https://fbref.com/en/comps/9/Premier-League-Stats"
CACHE_DIR = Path(__file__).parent / "data" / "raw"

DB_URL = os.environ.get("DATABASE_URL")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
}

def fetch_url(url):
    """Fetch URL using curl_cffi to bypass Cloudflare bot detection."""
    response = requests.get(url, impersonate="chrome", timeout=30)
    response.raise_for_status()
    return response.text

# map 'stat_type' to a unique substring found in that table's html id
# e.g., id="stats_standard_9" -> we look for "stats_standard_"
STAT_TABLE_IDS = {
    "players": "stats_standard_",
    "goalkeeping": "stats_keeper_",
    "advanced_goalkeeping": "stats_keeper_adv_",
    "shooting": "stats_shooting_",
    "passing": "stats_passing_",
    "passtypes": "stats_passing_types_",
    "goal_and_shot_creation": "stats_gca_",
    "defensive_actions": "stats_defense_",
    "possession": "stats_possession_",
    "playing_time": "stats_playing_time_",
    "miscstats": "stats_misc_",
}

def clean_html(html_content):
    """
    fbref comments out non-essential tables. we need to remove comment tags
    to make them parsable by bs4/pandas.
    """
    # this is a bit hacky but fastest way to ensure all tables are visible
    # strictly speaking, regex on html is bad, but for un-commenting blocks it works fine here
    return re.sub(r'', '', html_content)

def scrape_pl_table():
    """
    scrape the premier league table from fbref to get team names and links.
    Also saves the league table as raw CSV.
    """
    print("[1/3] scraping pl table...")
    
    try:
        html_content = fetch_url(PL_TABLE_URL)
        
        # DO NOT clean_html here. the main table is visible by default.
        # regexing the whole page can break the parser on the main table structure.
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # find the main league table
        table = soup.find('table', id=lambda x: x and 'results' in x and 'overall' in x)
        
        if not table:
            print("   x no table found!")
            return []
        
        # Save raw league table CSV
        league_df = pd.read_html(StringIO(str(table)))[0]
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        league_df.to_csv(CACHE_DIR / "league_table.csv", index=False)
        print(f"   v saved raw league table ({len(league_df)} rows)")
        
        teams = []
        rows = table.find('tbody').find_all('tr')
        
        for row in rows:
            # check both td and th (sometimes team names are headers in certain views)
            # check both 'team' and 'squad' data-stats
            team_cell = (
                row.find('td', {'data-stat': 'team'}) or 
                row.find('th', {'data-stat': 'team'}) or
                row.find('td', {'data-stat': 'squad'})
            )
            
            if team_cell:
                link = team_cell.find('a')
                if link and '/squads/' in link['href']:
                    team_name = link.text.strip()
                    # avoid duplicates if the parser hits a weird mobile view row
                    if not any(t['team_name'] == team_name for t in teams):
                        teams.append({
                            'team_name': team_name,
                            'team_link': FBREF_BASE_URL + link['href']
                        })

        print(f"   v found {len(teams)} teams")
        
        # simple debug to see who is missing if it happens again
        if len(teams) != 20:
            print(f"   !!!! warning: expected 20 teams, found {len(teams)}")
            print(f"   found: {', '.join([t['team_name'] for t in teams])}")
            
        return teams
        
    except Exception as e:
        print(f"   x error scraping pl table: {e}")
        return []

def get_cached_page(url, cache_key):
    cache_path = CACHE_DIR / f"{cache_key}.html"
    
    if cache_path.exists():
        print(f"   (cached: {cache_key})")
        with open(cache_path, 'r', encoding='utf-8') as f:
            return BeautifulSoup(f.read(), 'html.parser')
    
    try:
        time.sleep(3) # fbref is strict, 2s is pushing it. 3s is safer.
        html_content = fetch_url(url)
        
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        
        # CRITICAL: clean the html BEFORE saving/parsing to expose hidden tables
        cleaned_html = clean_html(html_content)
        
        with open(cache_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_html)
        
        print(f"   (fetched: {cache_key})")
        return BeautifulSoup(cleaned_html, 'html.parser')
    
    except Exception as e:
        print(f"   x error fetching {cache_key}: {e}")
        return None

def scrape_squad_page(team_name, team_link):
    print(f"\n[2/3] scraping {team_name}...")
    
    cache_key = f"squad_{team_name.replace(' ', '_')}"
    soup = get_cached_page(team_link, cache_key)
    
    if not soup:
        return {}
    
    tables_data = {}
    
    for stat_type, id_substring in STAT_TABLE_IDS.items():
        try:
            # find table by id substring
            table = soup.find('table', id=lambda x: x and id_substring in x)
            
            if table:
                # pandas read_html returns a list, take [0]
                df = pd.read_html(StringIO(str(table)))[0]
                
                # clean up multi-level columns if they exist (common in fbref)
                if isinstance(df.columns, pd.MultiIndex):
                    df.columns = ['_'.join(col).strip() for col in df.columns.values]
                
                tables_data[stat_type] = df
                print(f"   v {stat_type} ({len(df)} rows)")
            else:
                print(f"   x {stat_type} table not found (id like '{id_substring}')")
                
        except Exception as e:
            print(f"   x error scraping {stat_type}: {e}")
    
    return tables_data

def save_team_tables(team_name, tables_data):
    for stat_type, df in tables_data.items():
        stat_dir = CACHE_DIR / stat_type
        stat_dir.mkdir(parents=True, exist_ok=True)
        csv_path = stat_dir / f"{team_name.replace(' ', '_')}-{stat_type}.csv"
        df.to_csv(csv_path, index=False)


def format_tables():
    """Format all raw tables into standardized output tables."""
    print("\n[3/3] formatting tables...")
    
    from format.leaguetable import create_league_table
    from format.players import create_players_table
    from format.shooting import create_shooting_table
    from format.goalkeeping import create_goalkeeping_table, create_advanced_goalkeeping_table
    from format.passing import create_passing_table
    from format.passtypes import create_pass_types_table
    from format.gsconversion import create_goal_and_shot_conversion_table
    from format.defensiveactions import create_defensive_actions_table
    from format.possession import create_possession_table
    from format.playingtime import create_playing_time_table
    from format.miscstats import create_misc_stats_table
    
    create_league_table()
    create_players_table()
    create_shooting_table()
    create_goalkeeping_table()
    create_advanced_goalkeeping_table()
    create_passing_table()
    create_pass_types_table()
    create_goal_and_shot_conversion_table()
    create_defensive_actions_table()
    create_possession_table()
    create_playing_time_table()
    create_misc_stats_table()


def run_pipeline():
    print("starting extraction...")
    teams = scrape_pl_table()
    
    if not teams: return

    for team in teams:
        tables = scrape_squad_page(team['team_name'], team['team_link'])
        if tables:
            save_team_tables(team['team_name'], tables)
    
    # Format all tables
    print("Formatting new tables...")
    format_tables()

    # Update database
    print("Updating database for new gameweek...")
    gw_update_db()
    
    print("\ndone.")

if __name__ == "__main__":
    run_pipeline()