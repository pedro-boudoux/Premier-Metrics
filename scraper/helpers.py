import os
import pandas as pd


def cleanGkCols(base_dir=None):
    """
    For all CSV files in the goalkeeping/ folder, rename any column named 'Save%.1' to 'PKSave%'.
    If base_dir is not provided, uses the tables directory relative to this script.
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'goalkeeping')

    else:

        base_dir = os.path.join(base_dir, 'goalkeeping')

    for csv_file in os.listdir(base_dir):

        if csv_file.endswith('.csv'):

            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)

            if 'Save%.1' in df.columns:

                df = df.rename(columns={'Save%.1': 'PKSave%'})
                print(f"Renamed 'Save%.1' to 'PKSave%' in {csv_file}")
                df.to_csv(csv_path, index=False)

            else:
                
                print(f"No 'Save%.1' column in {csv_file}")

def removeBloatCols(base_dir=None):
    """
    Reads all CSV files in each folder inside tables/ and removes columns titled 'Matches' and rows called 'Total'.
    If base_dir is not provided, uses the tables directory relative to this script.
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables')

    for stat_folder in os.listdir(base_dir):

        stat_folder_path = os.path.join(base_dir, stat_folder)

        if os.path.isdir(stat_folder_path):

            for csv_file in os.listdir(stat_folder_path):

                if csv_file.endswith('.csv'):

                    csv_path = os.path.join(stat_folder_path, csv_file)
                    df = pd.read_csv(csv_path)

                    if 'Matches' in df.columns:

                        df = df.drop(columns=['Matches'])
                        
                    first_col = df.columns[0]
                    df = df[df[first_col] != 'Total']
                    df.to_csv(csv_path, index=False)

def fixAgeCols(base_dir=None):
    """
    Goes through every CSV file in every folder in tables/ and changes the 'Age' column
    to only keep the first two digits (e.g., '22-099' -> '22').
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables')

    for stat_folder in os.listdir(base_dir):

        stat_folder_path = os.path.join(base_dir, stat_folder)

        if os.path.isdir(stat_folder_path):

            for csv_file in os.listdir(stat_folder_path):

                if csv_file.endswith('.csv'):

                    csv_path = os.path.join(stat_folder_path, csv_file)
                    df = pd.read_csv(csv_path)

                    if 'Age' in df.columns:
                        
                        df['Age'] = df['Age'].astype(str).str[:2]
                        df.to_csv(csv_path, index=False)
                        print(f"Cleaned 'Age' column in {csv_file}")

def checkDuplicateCols(base_dir=None):
    """
    Checks one CSV file in each folder inside tables/ for duplicate column names.
    Prints the name of the folder if a file with duplicate column names is found.
    Otherwise, prints a message for each folder and a summary at the end.
    """
    if base_dir is None:

        base_dir = os.path.join(os.path.dirname(__file__), 'tables')

    found_duplicate = False

    for stat_folder in os.listdir(base_dir):

        stat_folder_path = os.path.join(base_dir, stat_folder)

        if os.path.isdir(stat_folder_path):

            # Find the first CSV file in the folder
            csv_files = [f for f in os.listdir(stat_folder_path) if f.endswith('.csv')]

            if csv_files:

                csv_path = os.path.join(stat_folder_path, csv_files[0])
                df = pd.read_csv(csv_path)
                col_counts = df.columns.value_counts()

                if any(col_counts > 1):

                    print(f"Duplicate column names found in folder: {stat_folder}")
                    found_duplicate = True

                else:

                    print(f"No duplicate columns in {stat_folder}")

    if not found_duplicate:
        
        print("no duplicate columns at all")

def renameShootingCols(base_dir=None):
    """
    Renames the columns in all shooting tables (tables/shooting/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'goals',
        'total_shots',
        'shots_on_target',
        'shots_on_target_percent',
        'shots_per_90',
        'shots_on_target_per_90',
        'goals_per_shot',
        'goals_per_shot_on_target',
        'average_shot_distance',
        'shots_from_fks',
        'pk_scored',
        'pk_attempted',
        'xG',
        'npxG',
        'npxG_per_shot',
        'goals_xG_diff',
        'np_goals_npxG_diff'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'shooting')
    else:
        base_dir = os.path.join(base_dir, 'shooting')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renameGoalkeepingCols(base_dir=None):
    """
    Renames the columns in all goalkeeping tables (tables/goalkeeping/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        'matches_played',
        'starts',
        'minutes',
        '90s_played',
        'goals_against',
        'goals_against_per_90',
        'shots_on_target_against',
        'saves',
        'save_percent',
        'wins',
        'draws',
        'losses',
        'clean_sheets',
        'clean_sheet_percent',
        'pk_attempted',
        'pk_allowed',
        'pk_saved',
        'pk_missed',
        'pk_save_percent'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'goalkeeping')
    else:
        base_dir = os.path.join(base_dir, 'goalkeeping')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renameAdvancedGoalkeepingCols(base_dir=None):
    """
    Renames the columns in all advanced_goalkeeping tables (tables/advanced_goalkeeping/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'goals_against',
        'pk_allowed',
        'fk_goals_against',
        'corner_goals_against',
        'ogs_against_gk',
        'post_shot_xg',
        'post_shot_xg_per_shot_on_target',
        'post_shot_xg_goals_allowed_diff',
        'post_shot_xg_goals_allowed_p90_diff',
        'launched_passes_completed',
        'launched_passes_attempted',
        'pass_completion_percent',
        'passes_attempted_non_goal_kick',
        'throws_attempted',
        'non_goal_kick_launch_percent',
        'non_goal_kick_avg_pass_length',
        'goal_kicks_attempted',
        'launched_goal_kick_percentage',
        'avg_goal_kick_length',
        'crosses_faced',
        'crosses_stopped',
        'crosses_stopped_percent',
        'defensive_actions_outside_pen_area',
        'defensive_actions_outside_pen_area_per_ninety',
        'avg_distance_of_defensive_actions'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'advanced_goalkeeping')
    else:
        base_dir = os.path.join(base_dir, 'advanced_goalkeeping')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renamePassingCols(base_dir=None):
    """
    Renames the columns in all passing tables (tables/passing/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'total_passes_completed',
        'total_passes_attempted',
        'pass_completion_percentage',
        'total_passing_distance',
        'progressive_passing_distance',
        'short_passes_completed',
        'short_passes_attempted',
        'short_pass_completion_percentage',
        'medium_passes_completed',
        'medium_passes_attempted',
        'medium_pass_completion_percentage',
        'long_passes_completed',
        'long_passes_attempted',
        'long_pass_completion_percentage',
        'assists',
        'xAG',
        'xA',
        'assist_xAG_diff',
        'key_passes',
        'passes_into_final_third',
        'passes_into_penalty_area',
        'crosses_into_penalty_area',
        'progressive_passes'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'passing')
    else:
        base_dir = os.path.join(base_dir, 'passing')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renamePassTypesCols(base_dir=None):
    """
    Renames the columns in all pass_types tables (tables/pass_types/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'total_passes_attempted',
        'live_ball_passes',
        'dead_ball_passes',
        'free_kick_passes',
        'through_balls',
        'switches',
        'crosses',
        'throw_ins_taken',
        'corners_taken',
        'inswinging_corners',
        'outswinging_corners',
        'straight_corners',
        'total_passes_completed',
        'passes_offside',
        'passes_blocked'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'pass_types')
    else:
        base_dir = os.path.join(base_dir, 'pass_types')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renameGoalAndShotCreationCols(base_dir=None):
    """
    Renames the columns in all goal_and_shot_creation tables (tables/goal_and_shot_creation/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'shot_creating_actions',
        'shot_creating_actions_per_90',
        'live_passes_sca',
        'dead_passes_sca',
        'take_ons_sca',
        'shots_sca',
        'fouls_drawn_sca',
        'def_sca',
        'goal_creating_actions',
        'gca_per_ninety',
        'live_passes_gca',
        'dead_passes_gca',
        'take_ons_gca',
        'shots_gca',
        'fouls_drawn_gca',
        'def_gca'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'goal_and_shot_creation')
    else:
        base_dir = os.path.join(base_dir, 'goal_and_shot_creation')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renameDefensiveActionsCols(base_dir=None):
    """
    Renames the columns in all defensive_actions tables (tables/defensive_actions/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'tackles',
        'tackles_won',
        'defensive_third_tackles',
        'middle_third_tackles',
        'attacking_third_tackles',
        'dribblers_tackled',
        'dribblers_challenged',
        'dribblers_tackled_percent',
        'challenges_lost',
        'blocks',
        'shots_blocked',
        'passses_blocked',
        'interceptions',
        'tackles_and_interceptions',
        'clearances',
        'shot_leading_errors'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'defensive_actions')
    else:
        base_dir = os.path.join(base_dir, 'defensive_actions')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renamePossessionCols(base_dir=None):
    """
    Renames the columns in all possession tables (tables/possession/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'touches',
        'touches_in_def_pen_area',
        'touches_in_def_third',
        'touches_in_mid_third',
        'touches_in_att_third',
        'touches_in_att_pen_area',
        'live_ball_touches',
        'attempted_take_ons',
        'successful_take_ons',
        'successful_take_ons_percent',
        'tackled_during_take_on',
        'tackled_during_take_on_percent',
        'carries',
        'total_carrying_distance',
        'progressive_carrying_distance',
        'progressive_carries',
        'carries_into_final_third',
        'carries_into_pen_area',
        'miscontrols',
        'times_dispossessed',
        'passes_received',
        'progressive_passes_received'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'possession')
    else:
        base_dir = os.path.join(base_dir, 'possession')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renamePlayingTimeCols(base_dir=None):
    """
    Renames the columns in all playing_time tables (tables/playing_time/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        'matches_played',
        'minutes_played',
        'minutes_per_match',
        'percent_of_squad_mins_played',
        '90s_played',
        'starts',
        'minutes_per_start',
        'complete_matches_played',
        'sub_appearances',
        'minutes_per_sub',
        'matches_as_unused_sub',
        'points_per_match',
        'goals_scored_by_team_while_on_pitch',
        'goals_allowed_by_team_while_on_pitch',
        'goals_scored_goals_allowed_while_on_pitch_diff',
        'goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played',
        'net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety',
        'team_xG_while_on_pitch',
        'team_xGA_while_on_pitch',
        'team_xGdiff_while_on_pitch',
        'team_xGdiff_while_on_pitch_per_ninety',
        'team_xG_plus_minus_net_diff_while_on_pitch'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'playing_time')
    else:
        base_dir = os.path.join(base_dir, 'playing_time')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renameMiscStatsCols(base_dir=None):
    """
    Renames the columns in all misc_stats tables (tables/misc_stats/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        '90s_played',
        'yellow_cards',
        'red_cards',
        'second_yellow_cards',
        'fouls_commited',
        'fouls_drawn',
        'offsides',
        'crosses',
        'interceptions',
        'tackles_won',
        'pk_won',
        'pk_conceded',
        'own_goals',
        'ball_recoveries',
        'aerial_duels_won',
        'aerial_duels_lost',
        'aerial_duels_won_percent'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'misc_stats')
    else:
        base_dir = os.path.join(base_dir, 'misc_stats')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")

def renamePlayerSummariesCols(base_dir=None):
    """
    Renames the columns in all player_summaries tables (tables/player_summaries/) to the specified list, in order.
    """
    import os
    import pandas as pd
    new_columns = [
        'player',
        'nation',
        'position',
        'age',
        'matches_played',
        'starts',
        'minutes',
        '90s_played',
        'goals',
        'assists',
        'goals_and_assists',
        'non_pk_goals',
        'pks_scored',
        'pks_attempted',
        'yellow_cards',
        'red_cards',
        'xG',
        'npxG',
        'xAG',
        'npxG_plus_xAG',
        'progressive_carries',
        'progressive_passes',
        'progressive_passes_received',
        'goals_per_90',
        'assists_per_90',
        'goals_and_assists_per_90',
        'non_pk_goals_per_90',
        'npG_and_assists_per_90',
        'xG_per_90',
        'xAG_per_90',
        'xG_plus_xAG_per_90',
        'npxG_per_90',
        'npxG_plus_xAG_per_90'
    ]
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables', 'player_summaries')
    else:
        base_dir = os.path.join(base_dir, 'player_summaries')
    for csv_file in os.listdir(base_dir):
        if csv_file.endswith('.csv'):
            csv_path = os.path.join(base_dir, csv_file)
            df = pd.read_csv(csv_path)
            if len(df.columns) >= len(new_columns):
                df.columns = new_columns + list(df.columns[len(new_columns):])
            else:
                df.columns = new_columns[:len(df.columns)]
            df.to_csv(csv_path, index=False)
            print(f"Renamed columns in {csv_file}")
