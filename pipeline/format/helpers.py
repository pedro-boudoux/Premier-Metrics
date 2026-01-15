"""
Shared utilities for formatting raw tables into standardized output.
"""
import pandas as pd
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent
RAW_TABLES_DIR = BASE_DIR / "data" / "raw"
FORMATTED_TABLES_DIR = BASE_DIR / "data" / "formatted"

# Column mappings from fbref multi-level column names to standardized names
# Format: "Original_Column" -> "output_column"

PLAYERS_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_MP": "matches_played",
    "Playing Time_Starts": "starts",
    "Playing Time_Min": "minutes",
    "Playing Time_90s": "90s_played",
    "Performance_Gls": "goals",
    "Performance_Ast": "assists",
    "Performance_G+A": "goals_and_assists",
    "Performance_G-PK": "non_pk_goals",
    "Performance_PK": "pks_scored",
    "Performance_PKatt": "pks_attempted",
    "Performance_CrdY": "yellow_cards",
    "Performance_CrdR": "red_cards",
    "Expected_xG": "xG",
    "Expected_npxG": "npxG",
    "Expected_xAG": "xAG",
    "Expected_npxG+xAG": "npxG_plus_xAG",
    "Progression_PrgC": "progressive_carries",
    "Progression_PrgP": "progressive_passes",
    "Progression_PrgR": "progressive_passes_received",
    "Per 90 Minutes_Gls": "goals_per_90",
    "Per 90 Minutes_Ast": "assists_per_90",
    "Per 90 Minutes_G+A": "goals_and_assists_per_90",
    "Per 90 Minutes_G-PK": "non_pk_goals_per_90",
    "Per 90 Minutes_G+A-PK": "npG_and_assists_per_90",
    "Per 90 Minutes_xG": "xG_per_90",
    "Per 90 Minutes_xAG": "xAG_per_90",
    "Per 90 Minutes_xG+xAG": "xG_plus_xAG_per_90",
    "Per 90 Minutes_npxG": "npxG_per_90",
    "Per 90 Minutes_npxG+xAG": "npxG_plus_xAG_per_90",
}

SHOOTING_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Standard_Gls": "goals",
    "Standard_Sh": "total_shots",
    "Standard_SoT": "shots_on_target",
    "Standard_SoT%": "shots_on_target_percent",
    "Standard_Sh/90": "shots_per_90",
    "Standard_SoT/90": "shots_on_target_per_90",
    "Standard_G/Sh": "goals_per_shot",
    "Standard_G/SoT": "goals_per_shot_on_target",
    "Standard_Dist": "average_shot_distance",
    "Standard_FK": "shots_from_fks",
    "Standard_PK": "pk_scored",
    "Standard_PKatt": "pk_attempted",
    "Expected_xG": "xg",
    "Expected_npxG": "npxg",
    "Expected_npxG/Sh": "npxg_per_shot",
    "Expected_G-xG": "goals_xg_diff",
    "Expected_np:G-xG": "np_goals_npxg_diff",
}

GOALKEEPING_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Playing Time_MP": "matches_played",
    "Playing Time_Starts": "starts",
    "Playing Time_Min": "minutes",
    "Playing Time_90s": "90s_played",
    "Performance_GA": "goals_against",
    "Performance_GA90": "goals_against_per_90",
    "Performance_SoTA": "shots_on_target_against",
    "Performance_Saves": "saves",
    "Performance_Save%": "save_percent",
    "Performance_W": "wins",
    "Performance_D": "draws",
    "Performance_L": "losses",
    "Performance_CS": "clean_sheets",
    "Performance_CS%": "clean_sheet_percent",
    "Penalty Kicks_PKatt": "pk_attempted",
    "Penalty Kicks_PKA": "pk_allowed",
    "Penalty Kicks_PKsv": "pk_saved",
    "Penalty Kicks_PKm": "pk_missed",
    "Penalty Kicks_Save%": "pk_save_percent",
}

ADVANCED_GOALKEEPING_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Goals_GA": "goals_against",
    "Goals_PKA": "pk_allowed",
    "Goals_FK": "fk_goals_against",
    "Goals_CK": "corner_goals_against",
    "Goals_OG": "ogs_against_gk",
    "Expected_PSxG": "post_shot_xg",
    "Expected_PSxG/SoT": "post_shot_xg_per_shot_on_target",
    "Expected_PSxG+/-": "post_shot_xg_goals_allowed_diff",
    "Expected_/90": "post_shot_xg_goals_allowed_p90_diff",
    "Launched_Cmp": "launched_passes_completed",
    "Launched_Att": "launched_passes_attempted",
    "Launched_Cmp%": "pass_completion_percent",
    "Passes_Att (GK)": "passes_attempted_non_goal_kick",
    "Passes_Thr": "throws_attempted",
    "Passes_Launch%": "non_goal_kick_launch_percent",
    "Passes_AvgLen": "non_goal_kick_avg_pass_length",
    "Goal Kicks_Att": "goal_kicks_attempted",
    "Goal Kicks_Launch%": "launched_goal_kick_percentage",
    "Goal Kicks_AvgLen": "avg_goal_kick_length",
    "Crosses_Opp": "crosses_faced",
    "Crosses_Stp": "crosses_stopped",
    "Crosses_Stp%": "crosses_stopped_percent",
    "Sweeper_#OPA": "defensive_actions_outside_pen_area",
    "Sweeper_#OPA/90": "defensive_actions_outside_pen_area_per_ninety",
    "Sweeper_AvgDist": "avg_distance_of_defensive_actions",
}

PASSING_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Total_Cmp": "total_passes_completed",
    "Total_Att": "total_passes_attempted",
    "Total_Cmp%": "pass_completion_percentage",
    "Total_TotDist": "total_passing_distance",
    "Total_PrgDist": "progressive_passing_distance",
    "Short_Cmp": "short_passes_completed",
    "Short_Att": "short_passes_attempted",
    "Short_Cmp%": "short_pass_completion_percentage",
    "Medium_Cmp": "medium_passes_completed",
    "Medium_Att": "medium_passes_attempted",
    "Medium_Cmp%": "medium_pass_completion_percentage",
    "Long_Cmp": "long_passes_completed",
    "Long_Att": "long_passes_attempted",
    "Long_Cmp%": "long_pass_completion_percentage",
    "Unnamed: 19_level_0_Ast": "assists",
    "Unnamed: 20_level_0_xAG": "xag",
    "Expected_xA": "xa",
    "Expected_A-xAG": "assist_xag_diff",
    "Unnamed: 23_level_0_KP": "key_passes",
    "Unnamed: 24_level_0_1/3": "passes_into_final_third",
    "Unnamed: 25_level_0_PPA": "passes_into_penalty_area",
    "Unnamed: 26_level_0_CrsPA": "crosses_into_penalty_area",
    "Unnamed: 27_level_0_PrgP": "progressive_passes",
}

PASSTYPES_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Unnamed: 5_level_0_Att": "total_passes_attempted",
    "Pass Types_Live": "live_ball_passes",
    "Pass Types_Dead": "dead_ball_passes",
    "Pass Types_FK": "free_kick_passes",
    "Pass Types_TB": "through_balls",
    "Pass Types_Sw": "switches",
    "Pass Types_Crs": "crosses",
    "Pass Types_TI": "throw_ins_taken",
    "Pass Types_CK": "corners_taken",
    "Corner Kicks_In": "inswinging_corners",
    "Corner Kicks_Out": "outswinging_corners",
    "Corner Kicks_Str": "straight_corners",
    "Outcomes_Cmp": "total_passes_completed",
    "Outcomes_Off": "passes_offside",
    "Outcomes_Blocks": "passes_blocked",
}

GCA_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "SCA_SCA": "shot_creating_actions",
    "SCA_SCA90": "shot_creating_actions_per_90",
    "SCA Types_PassLive": "live_passes_sca",
    "SCA Types_PassDead": "dead_passes_sca",
    "SCA Types_TO": "take_ons_sca",
    "SCA Types_Sh": "shots_sca",
    "SCA Types_Fld": "fouls_drawn_sca",
    "SCA Types_Def": "def_sca",
    "GCA_GCA": "goal_creating_actions",
    "GCA_GCA90": "gca_per_ninety",
    "GCA Types_PassLive": "live_passes_gca",
    "GCA Types_PassDead": "dead_passes_gca",
    "GCA Types_TO": "take_ons_gca",
    "GCA Types_Sh": "shots_gca",
    "GCA Types_Fld": "fouls_drawn_gca",
    "GCA Types_Def": "def_gca",
}

DEFENSIVE_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Tackles_Tkl": "tackles",
    "Tackles_TklW": "tackles_won",
    "Tackles_Def 3rd": "defensive_third_tackles",
    "Tackles_Mid 3rd": "middle_third_tackles",
    "Tackles_Att 3rd": "attacking_third_tackles",
    "Challenges_Tkl": "dribblers_tackled",
    "Challenges_Att": "dribblers_challenged",
    "Challenges_Tkl%": "dribblers_tackled_percent",
    "Challenges_Lost": "challenges_lost",
    "Blocks_Blocks": "blocks",
    "Blocks_Sh": "shots_blocked",
    "Blocks_Pass": "passses_blocked",  # typo preserved from old scraper
    "Unnamed: 17_level_0_Int": "interceptions",
    "Unnamed: 18_level_0_Tkl+Int": "tackles_and_interceptions",
    "Unnamed: 19_level_0_Clr": "clearances",
    "Unnamed: 20_level_0_Err": "shot_leading_errors",
}

POSSESSION_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Touches_Touches": "touches",
    "Touches_Def Pen": "touches_in_def_pen_area",
    "Touches_Def 3rd": "touches_in_def_third",
    "Touches_Mid 3rd": "touches_in_mid_third",
    "Touches_Att 3rd": "touches_in_att_third",
    "Touches_Att Pen": "touches_in_att_pen_area",
    "Touches_Live": "live_ball_touches",
    "Take-Ons_Att": "attempted_take_ons",
    "Take-Ons_Succ": "successful_take_ons",
    "Take-Ons_Succ%": "successful_take_ons_percent",
    "Take-Ons_Tkld": "tackled_during_take_on",
    "Take-Ons_Tkld%": "tackled_during_take_on_percent",
    "Carries_Carries": "carries",
    "Carries_TotDist": "total_carrying_distance",
    "Carries_PrgDist": "progressive_carrying_distance",
    "Carries_PrgC": "progressive_carries",
    "Carries_1/3": "carries_into_final_third",
    "Carries_CPA": "carries_into_pen_area",
    "Carries_Mis": "miscontrols",
    "Carries_Dis": "times_dispossessed",
    "Receiving_Rec": "passes_received",
    "Receiving_PrgR": "progressive_passes_received",
}

PLAYING_TIME_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_MP": "matches_played",
    "Playing Time_Min": "minutes_played",
    "Playing Time_Mn/MP": "minutes_per_match",
    "Playing Time_Min%": "percent_squad_mins",
    "Playing Time_90s": "nineties_played",
    "Starts_Starts": "starts",
    "Starts_Mn/Start": "minutes_per_start",
    "Starts_Compl": "complete_matches",
    "Subs_Subs": "sub_appearances",
    "Subs_Mn/Sub": "minutes_per_sub",
    "Subs_unSub": "unused_sub_matches",
    "Team Success_PPM": "points_per_match",
    "Team Success_onG": "team_goals_for",
    "Team Success_onGA": "team_goals_against",
    "Team Success_+/-": "goal_diff",
    "Team Success_+/-90": "goal_diff_per_90",
    "Team Success_On-Off": "net_goal_diff_per_90",
    "Team Success (xG)_onxG": "team_xg",
    "Team Success (xG)_onxGA": "team_xga",
    "Team Success (xG)_xG+/-": "team_xg_diff",
    "Team Success (xG)_xG+/-90": "team_xg_diff_per_90",
    "Team Success (xG)_On-Off": "team_xg_plus_minus_net_diff",
}

MISCSTATS_COLUMNS = {
    "Unnamed: 0_level_0_Player": "player",
    "Unnamed: 1_level_0_Nation": "nation",
    "Unnamed: 2_level_0_Pos": "position",
    "Unnamed: 3_level_0_Age": "age",
    "Unnamed: 4_level_0_90s": "90s_played",
    "Performance_CrdY": "yellow_cards",
    "Performance_CrdR": "red_cards",
    "Performance_2CrdY": "second_yellow_cards",
    "Performance_Fls": "fouls_commited",
    "Performance_Fld": "fouls_drawn",
    "Performance_Off": "offsides",
    "Performance_Crs": "crosses",
    "Performance_Int": "interceptions",
    "Performance_TklW": "tackles_won",
    "Performance_PKwon": "pk_won",
    "Performance_PKcon": "pk_conceded",
    "Performance_OG": "own_goals",
    "Performance_Recov": "ball_recoveries",
    "Aerial Duels_Won": "aerial_duels_won",
    "Aerial Duels_Lost": "aerial_duels_lost",
    "Aerial Duels_Won%": "aerial_duels_won_percent",
}


def get_team_from_filename(filename: str) -> str:
    """Extract team name from filename like 'Arsenal-players.csv' -> 'Arsenal'"""
    return filename.split('-')[0].replace('_', ' ')


def fix_age(age_str) -> str:
    """Truncate age to first 2 digits: '22-099' -> '22'"""
    if pd.isna(age_str):
        return ''
    return str(age_str)[:2]


def is_valid_player_row(row, player_col='player') -> bool:
    """Check if row is a valid player (not header row or total row)"""
    player = row.get(player_col, '')
    if pd.isna(player):
        return False
    player_str = str(player).strip().lower()
    return player_str not in ['player', 'squad total', 'opponent total', '']


def load_team_csvs(stat_type: str) -> list:
    """Load all team CSVs for a given stat type."""
    stat_dir = RAW_TABLES_DIR / stat_type
    if not stat_dir.exists():
        print(f"   x directory not found: {stat_dir}")
        return []
    
    csv_files = list(stat_dir.glob("*.csv"))
    return csv_files


def create_formatted_table(stat_type: str, column_mapping: dict, output_columns: list) -> pd.DataFrame:
    """
    Generic function to create a formatted table from raw CSVs.
    
    Args:
        stat_type: Name of the stat directory (e.g., 'shooting')
        column_mapping: Dict mapping raw column names to output column names
        output_columns: List of columns to include in output (in order)
    
    Returns:
        DataFrame with formatted data
    """
    csv_files = load_team_csvs(stat_type)
    all_rows = []
    
    for csv_file in csv_files:
        team_name = get_team_from_filename(csv_file.name)
        
        try:
            df = pd.read_csv(csv_file)
            
            # Rename columns using mapping
            df = df.rename(columns=column_mapping)
            
            # Fix age column if present
            if 'age' in df.columns:
                df['age'] = df['age'].apply(fix_age)
            
            # Add team column
            df['team'] = team_name
            
            # Filter valid player rows
            df = df[df.apply(lambda row: is_valid_player_row(row), axis=1)]
            
            all_rows.append(df)
            
        except Exception as e:
            print(f"   x error processing {csv_file.name}: {e}")
    
    if not all_rows:
        return pd.DataFrame()
    
    # Combine all teams
    result = pd.concat(all_rows, ignore_index=True)
    
    # Select and order columns (only include those that exist)
    available_cols = [col for col in output_columns if col in result.columns]
    result = result[available_cols]
    
    return result


def save_formatted_table(df: pd.DataFrame, table_name: str):
    """Save formatted DataFrame to CSV."""
    FORMATTED_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    output_path = FORMATTED_TABLES_DIR / f"{table_name}.csv"
    df.to_csv(output_path, index=False)
    print(f"   v saved {table_name}.csv ({len(df)} rows)")
