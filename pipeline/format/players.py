"""
Players table formatter.
Creates the master players table with unique IDs.
"""
import pandas as pd
from pathlib import Path
from .helpers import (
    RAW_TABLES_DIR, FORMATTED_TABLES_DIR, PLAYERS_COLUMNS, MISCSTATS_COLUMNS,
    get_team_from_filename, fix_age, is_valid_player_row, load_team_csvs,
    save_formatted_table
)


def create_players_table():
    """
    Create the players table from playing_time and misc_stats data.

    Output columns:
    - first_name, last_name, nation, team, positions, age, yellow_cards, red_cards
    """
    print("[FORMAT] Creating players table...")

    # Load misc_stats for yellow/red cards lookup
    misc_lookup = {}
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
                key = (player, team_name)
                misc_lookup[key] = {
                    'yellow_cards': float(row.get('yellow_cards', 0)),
                    'red_cards': float(row.get('red_cards', 0))
                }
        except Exception as e:
            print(f"   x error loading misc_stats {csv_file.name}: {e}")

    # Build players table from playing_time (has most complete roster)
    players_data = []

    playing_time_files = load_team_csvs("playing_time")

    # Column mapping for playing_time (different from players stat type)
    playing_time_cols = {
        "Unnamed: 0_level_0_Player": "player",
        "Unnamed: 1_level_0_Nation": "nation",
        "Unnamed: 2_level_0_Pos": "position",
        "Unnamed: 3_level_0_Age": "age",
    }

    for csv_file in playing_time_files:
        team_name = get_team_from_filename(csv_file.name)

        try:
            df = pd.read_csv(csv_file)
            df = df.rename(columns=playing_time_cols)

            for _, row in df.iterrows():
                if not is_valid_player_row(row):
                    continue

                player = str(row.get('player', '')).strip()

                # Split name into first/last
                name_parts = player.split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''

                # Get cards from misc_stats lookup
                misc_data = misc_lookup.get((player, team_name), {})

                # Convert age to int
                age_str = fix_age(row.get('age', ''))
                age = int(age_str) if age_str.isdigit() else None

                players_data.append({
                    'first_name': first_name,
                    'last_name': last_name,
                    'nation': row.get('nation', ''),
                    'team': team_name,
                    'positions': row.get('position', ''),
                    'age': age,
                    'yellow_cards': misc_data.get('yellow_cards', 0.0),
                    'red_cards': misc_data.get('red_cards', 0.0)
                })

        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")

    if not players_data:
        print("   x no player data found")
        return pd.DataFrame()

    result = pd.DataFrame(players_data)

    # Order columns
    output_cols = ['first_name', 'last_name', 'nation', 'team', 'positions', 'age', 'yellow_cards', 'red_cards']
    result = result[output_cols]

    save_formatted_table(result, "players")
    return result
