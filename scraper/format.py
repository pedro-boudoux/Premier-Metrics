import os
import pandas as pd
import numpy as np

def createPlayersTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called players.csv with columns:
    first_name (empty), last_name, nation, team, positions, age, yellow_cards, red_cards.
    Reads every CSV in tables/playing_time/ and extracts the required columns.
    Skips rows that are headers or do not contain valid player data.
    Merges yellow_cards and red_cards from misc_stats tables by player and team.
    """
    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    playing_time_dir = os.path.join(base_dir, 'playing_time')
    misc_stats_dir = os.path.join(base_dir, 'misc_stats')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'players.csv')

    # Build a dict of misc_stats for quick lookup: {(team, player): {yellow_cards, red_cards}}
    misc_lookup = {}
    for misc_file in os.listdir(misc_stats_dir):
        if misc_file.endswith('.csv'):
            team_name = misc_file.split('-')[0].replace('_', ' ')
            misc_path = os.path.join(misc_stats_dir, misc_file)
            misc_df = pd.read_csv(misc_path)
            for _, row in misc_df.iterrows():
                player = row['player'] if 'player' in row else row.get('Player', None)
                if pd.isnull(player) or player == 'player':
                    continue
                key = (team_name, player)
                yellow = row['yellow_cards'] if 'yellow_cards' in row else np.nan
                red = row['red_cards'] if 'red_cards' in row else np.nan
                misc_lookup[key] = {
                    'yellow_cards': yellow if not pd.isnull(yellow) else '',
                    'red_cards': red if not pd.isnull(red) else ''
                }

    all_rows = []
    for csv_file in os.listdir(playing_time_dir):
        if csv_file.endswith('.csv'):
            team_name = csv_file.split('-')[0].replace('_', ' ')
            csv_path = os.path.join(playing_time_dir, csv_file)
            df = pd.read_csv(csv_path)
            # Use lowercase column names as per helpers' renaming
            if 'player' in df.columns:
                valid_rows = df[df['player'].notnull()]
                for _, row in valid_rows.iterrows():
                    # Skip header-like rows
                    if str(row['player']).strip().lower() == 'player':
                        continue
                    if 'nation' in row and str(row['nation']).strip().lower() == 'nation':
                        continue
                    if 'age' in row and str(row['age']).strip().lower() in ['ag', 'age']:
                        continue
                    if 'position' in row and str(row['position']).strip().lower() in ['pos', 'position']:
                        continue
                    player = row['player']
                    key = (team_name, player)
                    yellow = misc_lookup.get(key, {}).get('yellow_cards', '')
                    red = misc_lookup.get(key, {}).get('red_cards', '')
                    all_rows.append({
                        'first_name': '',
                        'last_name': player,
                        'nation': row['nation'] if 'nation' in row else '',
                        'team': team_name,
                        'positions': row['position'] if 'position' in row else '',
                        'age': row['age'] if 'age' in row else '',
                        'yellow_cards': yellow,
                        'red_cards': red
                    })
    out_df = pd.DataFrame(all_rows, columns=['first_name', 'last_name', 'nation', 'team', 'positions', 'age', 'yellow_cards', 'red_cards'])
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createShootingTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called shooting.csv with columns:
    player_name, team, total_shots, shots_on_target, shots_on_target_percent, shots_per_90, shots_on_target_per_90,
    goals_per_shot, goals_per_shot_on_target, average_shot_distance, shots_from_fks, pk_scored, pk_attempted, xG, npxG,
    npxG_per_shot, goals_xG_diff, np_goals_npxG_diff, goals, non_pk_goals
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    shooting_dir = os.path.join(base_dir, 'shooting')
    player_summaries_dir = os.path.join(base_dir, 'player_summaries')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'shooting.csv')

    all_rows = []
    for shooting_file in os.listdir(shooting_dir):
        if not shooting_file.endswith('.csv'):
            continue
        team_key = shooting_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        shooting_path = os.path.join(shooting_dir, shooting_file)
        player_summaries_path = os.path.join(player_summaries_dir, f"{team_key}-player_summaries.csv")
        # Read shooting and player_summaries
        shooting_df = pd.read_csv(shooting_path)
        if os.path.exists(player_summaries_path):
            player_summaries_df = pd.read_csv(player_summaries_path)
            player_summaries_df = player_summaries_df[['player', 'non_pk_goals']]
        else:
            player_summaries_df = pd.DataFrame(columns=['player', 'non_pk_goals'])
        # Merge non_pk_goals into shooting_df
        merged_df = pd.merge(
            shooting_df,
            player_summaries_df,
            how='left',
            left_on='player',
            right_on='player'
        )
        for _, row in merged_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'total_shots': row.get('total_shots', ''),
                'shots_on_target': row.get('shots_on_target', ''),
                'shots_on_target_percent': row.get('shots_on_target_percent', ''),
                'shots_per_90': row.get('shots_per_90', ''),
                'shots_on_target_per_90': row.get('shots_on_target_per_90', ''),
                'goals_per_shot': row.get('goals_per_shot', ''),
                'goals_per_shot_on_target': row.get('goals_per_shot_on_target', ''),
                'average_shot_distance': row.get('average_shot_distance', ''),
                'shots_from_fks': row.get('shots_from_fks', ''),
                'pk_scored': row.get('pk_scored', ''),
                'pk_attempted': row.get('pk_attempted', ''),
                'xG': row.get('xG', ''),
                'npxG': row.get('npxG', ''),
                'npxG_per_shot': row.get('npxG_per_shot', ''),
                'goals_xG_diff': row.get('goals_xG_diff', ''),
                'np_goals_npxG_diff': row.get('np_goals_npxG_diff', ''),
                'goals': row.get('goals', ''),
                'non_pk_goals': row.get('non_pk_goals', '')
            })
    columns = [
        'player_name', 'team', 'total_shots', 'shots_on_target', 'shots_on_target_percent', 'shots_per_90',
        'shots_on_target_per_90', 'goals_per_shot', 'goals_per_shot_on_target', 'average_shot_distance',
        'shots_from_fks', 'pk_scored', 'pk_attempted', 'xG', 'npxG', 'npxG_per_shot', 'goals_xG_diff',
        'np_goals_npxG_diff', 'goals', 'non_pk_goals'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createGoalkeepingTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called goalkeeping.csv with columns:
    player_name, team, goals_against, goals_against_per_90, shots_on_target_against, saves, save_percent, wins, draws, losses,
    clean_sheets, clean_sheet_percent, pk_attempted, pk_allowed, pk_saved, pk_missed, pk_save_percent
    Reads every CSV in tables/goalkeeping/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    goalkeeping_dir = os.path.join(base_dir, 'goalkeeping')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'goalkeeping.csv')

    all_rows = []
    for gk_file in os.listdir(goalkeeping_dir):
        if not gk_file.endswith('.csv'):
            continue
        team_key = gk_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        gk_path = os.path.join(goalkeeping_dir, gk_file)
        gk_df = pd.read_csv(gk_path)
        for _, row in gk_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'goals_against': row.get('goals_against', ''),
                'goals_against_per_90': row.get('goals_against_per_90', ''),
                'shots_on_target_against': row.get('shots_on_target_against', ''),
                'saves': row.get('saves', ''),
                'save_percent': row.get('save_percent', ''),
                'wins': row.get('wins', ''),
                'draws': row.get('draws', ''),
                'losses': row.get('losses', ''),
                'clean_sheets': row.get('clean_sheets', ''),
                'clean_sheet_percent': row.get('clean_sheet_percent', ''),
                'pk_attempted': row.get('pk_attempted', ''),
                'pk_allowed': row.get('pk_allowed', ''),
                'pk_saved': row.get('pk_saved', ''),
                'pk_missed': row.get('pk_missed', ''),
                'pk_save_percent': row.get('pk_save_percent', '')
            })
    columns = [
        'player_name', 'team', 'goals_against', 'goals_against_per_90', 'shots_on_target_against', 'saves',
        'save_percent', 'wins', 'draws', 'losses', 'clean_sheets', 'clean_sheet_percent', 'pk_attempted',
        'pk_allowed', 'pk_saved', 'pk_missed', 'pk_save_percent'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createAdvancedGoalkeepingTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called advanced_goalkeeping.csv with columns:
    player_name, team, fk_goals_against, corner_goals_against, ogs_against_gk, post_shot_xg, post_shot_xg_per_shot_on_target,
    post_shot_xg_goals_allowed_diff, post_shot_xg_goals_allowed_p90_diff, launched_passes_completed, launched_passes_attempted,
    pass_completion_percent, passes_attempted_non_goal_kick, throws_attempted, non_goal_kick_launch_percent, non_goal_kick_avg_pass_length,
    goal_kicks_attempted, launched_goal_kick_percentage, avg_goal_kick_length, crosses_faced, crosses_stopped, crosses_stopped_percent,
    defensive_actions_outside_pen_area, defensive_actions_outside_pen_area_per_ninety, avg_distance_of_defensive_actions
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    adv_gk_dir = os.path.join(base_dir, 'advanced_goalkeeping')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'advanced_goalkeeping.csv')

    all_rows = []
    for adv_gk_file in os.listdir(adv_gk_dir):
        if not adv_gk_file.endswith('.csv'):
            continue
        team_key = adv_gk_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        adv_gk_path = os.path.join(adv_gk_dir, adv_gk_file)
        adv_gk_df = pd.read_csv(adv_gk_path)
        for _, row in adv_gk_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'fk_goals_against': row.get('fk_goals_against', ''),
                'corner_goals_against': row.get('corner_goals_against', ''),
                'ogs_against_gk': row.get('ogs_against_gk', ''),
                'post_shot_xg': row.get('post_shot_xg', ''),
                'post_shot_xg_per_shot_on_target': row.get('post_shot_xg_per_shot_on_target', ''),
                'post_shot_xg_goals_allowed_diff': row.get('post_shot_xg_goals_allowed_diff', ''),
                'post_shot_xg_goals_allowed_p90_diff': row.get('post_shot_xg_goals_allowed_p90_diff', ''),
                'launched_passes_completed': row.get('launched_passes_completed', ''),
                'launched_passes_attempted': row.get('launched_passes_attempted', ''),
                'pass_completion_percent': row.get('pass_completion_percent', ''),
                'passes_attempted_non_goal_kick': row.get('passes_attempted_non_goal_kick', ''),
                'throws_attempted': row.get('throws_attempted', ''),
                'non_goal_kick_launch_percent': row.get('non_goal_kick_launch_percent', ''),
                'non_goal_kick_avg_pass_length': row.get('non_goal_kick_avg_pass_length', ''),
                'goal_kicks_attempted': row.get('goal_kicks_attempted', ''),
                'launched_goal_kick_percentage': row.get('launched_goal_kick_percentage', ''),
                'avg_goal_kick_length': row.get('avg_goal_kick_length', ''),
                'crosses_faced': row.get('crosses_faced', ''),
                'crosses_stopped': row.get('crosses_stopped', ''),
                'crosses_stopped_percent': row.get('crosses_stopped_percent', ''),
                'defensive_actions_outside_pen_area': row.get('defensive_actions_outside_pen_area', ''),
                'defensive_actions_outside_pen_area_per_ninety': row.get('defensive_actions_outside_pen_area_per_ninety', ''),
                'avg_distance_of_defensive_actions': row.get('avg_distance_of_defensive_actions', '')
            })
    columns = [
        'player_name', 'team', 'fk_goals_against', 'corner_goals_against', 'ogs_against_gk', 'post_shot_xg',
        'post_shot_xg_per_shot_on_target', 'post_shot_xg_goals_allowed_diff', 'post_shot_xg_goals_allowed_p90_diff',
        'launched_passes_completed', 'launched_passes_attempted', 'pass_completion_percent',
        'passes_attempted_non_goal_kick', 'throws_attempted', 'non_goal_kick_launch_percent',
        'non_goal_kick_avg_pass_length', 'goal_kicks_attempted', 'launched_goal_kick_percentage',
        'avg_goal_kick_length', 'crosses_faced', 'crosses_stopped', 'crosses_stopped_percent',
        'defensive_actions_outside_pen_area', 'defensive_actions_outside_pen_area_per_ninety',
        'avg_distance_of_defensive_actions'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createPassingTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called passing.csv with columns:
    player_name, team, total_passes_completed, total_passes_attempted, pass_completion_percentage, total_passing_distance,
    progressive_passing_distance, short_passes_completed, short_passes_attempted, short_pass_completion_percentage,
    medium_passes_completed, medium_passes_attempted, medium_pass_completion_percentage, long_passes_completed,
    long_passes_attempted, long_pass_completion_percentage, assists, xAG, xA, assist_xAG_diff, key_passes,
    passes_into_final_third, passes_into_penalty_area, crosses_into_penalty_area, progressive_passes, assists_from_summary
    Reads every CSV in tables/passing/ and merges assists from player_summaries/.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    passing_dir = os.path.join(base_dir, 'passing')
    player_summaries_dir = os.path.join(base_dir, 'player_summaries')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'passing.csv')

    all_rows = []
    for passing_file in os.listdir(passing_dir):
        if not passing_file.endswith('.csv'):
            continue
        team_key = passing_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        passing_path = os.path.join(passing_dir, passing_file)
        player_summaries_path = os.path.join(player_summaries_dir, f"{team_key}-player_summaries.csv")
        # Read passing and player_summaries
        passing_df = pd.read_csv(passing_path)
        if os.path.exists(player_summaries_path):
            player_summaries_df = pd.read_csv(player_summaries_path)
            player_summaries_df = player_summaries_df[['player', 'assists']]
        else:
            player_summaries_df = pd.DataFrame(columns=['player', 'assists'])
        # Merge assists from player_summaries into passing_df
        merged_df = pd.merge(
            passing_df,
            player_summaries_df,
            how='left',
            left_on='player',
            right_on='player',
            suffixes=('', '_from_summary')
        )
        for _, row in merged_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'total_passes_completed': row.get('total_passes_completed', ''),
                'total_passes_attempted': row.get('total_passes_attempted', ''),
                'pass_completion_percentage': row.get('pass_completion_percentage', ''),
                'total_passing_distance': row.get('total_passing_distance', ''),
                'progressive_passing_distance': row.get('progressive_passing_distance', ''),
                'short_passes_completed': row.get('short_passes_completed', ''),
                'short_passes_attempted': row.get('short_passes_attempted', ''),
                'short_pass_completion_percentage': row.get('short_pass_completion_percentage', ''),
                'medium_passes_completed': row.get('medium_passes_completed', ''),
                'medium_passes_attempted': row.get('medium_passes_attempted', ''),
                'medium_pass_completion_percentage': row.get('medium_pass_completion_percentage', ''),
                'long_passes_completed': row.get('long_passes_completed', ''),
                'long_passes_attempted': row.get('long_passes_attempted', ''),
                'long_pass_completion_percentage': row.get('long_pass_completion_percentage', ''),
                'assists': row.get('assists', ''),
                'xAG': row.get('xAG', ''),
                'xA': row.get('xA', ''),
                'assist_xAG_diff': row.get('assist_xAG_diff', ''),
                'key_passes': row.get('key_passes', ''),
                'passes_into_final_third': row.get('passes_into_final_third', ''),
                'passes_into_penalty_area': row.get('passes_into_penalty_area', ''),
                'crosses_into_penalty_area': row.get('crosses_into_penalty_area', ''),
                'progressive_passes': row.get('progressive_passes', ''),
                'assists_from_summary': row.get('assists_from_summary', row.get('assists_y', ''))
            })
    columns = [
        'player_name', 'team', 'total_passes_completed', 'total_passes_attempted', 'pass_completion_percentage',
        'total_passing_distance', 'progressive_passing_distance', 'short_passes_completed', 'short_passes_attempted',
        'short_pass_completion_percentage', 'medium_passes_completed', 'medium_passes_attempted',
        'medium_pass_completion_percentage', 'long_passes_completed', 'long_passes_attempted',
        'long_pass_completion_percentage', 'assists', 'xAG', 'xA', 'assist_xAG_diff', 'key_passes',
        'passes_into_final_third', 'passes_into_penalty_area', 'crosses_into_penalty_area', 'progressive_passes',
        'assists_from_summary'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createPassTypesTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called pass_types.csv with columns:
    player_name, team, live_ball_passes, dead_ball_passes, free_kick_passes, through_balls, switches, crosses,
    throw_ins_taken, corners_taken, inswinging_corners, outswinging_corners, straight_corners, total_passes_completed,
    passes_offside, passes_blocked
    Reads every CSV in tables/pass_types/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    pass_types_dir = os.path.join(base_dir, 'pass_types')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'pass_types.csv')

    all_rows = []
    for pt_file in os.listdir(pass_types_dir):
        if not pt_file.endswith('.csv'):
            continue
        team_key = pt_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        pt_path = os.path.join(pass_types_dir, pt_file)
        pt_df = pd.read_csv(pt_path)
        for _, row in pt_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'live_ball_passes': row.get('live_ball_passes', ''),
                'dead_ball_passes': row.get('dead_ball_passes', ''),
                'free_kick_passes': row.get('free_kick_passes', ''),
                'through_balls': row.get('through_balls', ''),
                'switches': row.get('switches', ''),
                'crosses': row.get('crosses', ''),
                'throw_ins_taken': row.get('throw_ins_taken', ''),
                'corners_taken': row.get('corners_taken', ''),
                'inswinging_corners': row.get('inswinging_corners', ''),
                'outswinging_corners': row.get('outswinging_corners', ''),
                'straight_corners': row.get('straight_corners', ''),
                'total_passes_completed': row.get('total_passes_completed', ''),
                'passes_offside': row.get('passes_offside', ''),
                'passes_blocked': row.get('passes_blocked', '')
            })
    columns = [
        'player_name', 'team', 'live_ball_passes', 'dead_ball_passes', 'free_kick_passes', 'through_balls', 'switches',
        'crosses', 'throw_ins_taken', 'corners_taken', 'inswinging_corners', 'outswinging_corners', 'straight_corners',
        'total_passes_completed', 'passes_offside', 'passes_blocked'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createGoalAndShotConversionTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called goal_and_shot_conversion.csv with columns:
    player_name, team, shot_creating_actions, shot_creating_actions_per_90, live_passes_sca, dead_passes_sca, take_ons_sca,
    shots_sca, fouls_drawn_sca, def_sca, goal_creating_actions, gca_per_ninety, live_passes_gca, dead_passes_gca, take_ons_gca,
    shots_gca, fouls_drawn_gca, def_gca
    Reads every CSV in tables/goal_and_shot_creation/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    gsc_dir = os.path.join(base_dir, 'goal_and_shot_creation')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'goal_and_shot_conversion.csv')

    all_rows = []
    for gsc_file in os.listdir(gsc_dir):
        if not gsc_file.endswith('.csv'):
            continue
        team_key = gsc_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        gsc_path = os.path.join(gsc_dir, gsc_file)
        gsc_df = pd.read_csv(gsc_path)
        for _, row in gsc_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'shot_creating_actions': row.get('shot_creating_actions', ''),
                'shot_creating_actions_per_90': row.get('shot_creating_actions_per_90', ''),
                'live_passes_sca': row.get('live_passes_sca', ''),
                'dead_passes_sca': row.get('dead_passes_sca', ''),
                'take_ons_sca': row.get('take_ons_sca', ''),
                'shots_sca': row.get('shots_sca', ''),
                'fouls_drawn_sca': row.get('fouls_drawn_sca', ''),
                'def_sca': row.get('def_sca', ''),
                'goal_creating_actions': row.get('goal_creating_actions', ''),
                'gca_per_ninety': row.get('gca_per_ninety', ''),
                'live_passes_gca': row.get('live_passes_gca', ''),
                'dead_passes_gca': row.get('dead_passes_gca', ''),
                'take_ons_gca': row.get('take_ons_gca', ''),
                'shots_gca': row.get('shots_gca', ''),
                'fouls_drawn_gca': row.get('fouls_drawn_gca', ''),
                'def_gca': row.get('def_gca', '')
            })
    columns = [
        'player_name', 'team', 'shot_creating_actions', 'shot_creating_actions_per_90', 'live_passes_sca',
        'dead_passes_sca', 'take_ons_sca', 'shots_sca', 'fouls_drawn_sca', 'def_sca', 'goal_creating_actions',
        'gca_per_ninety', 'live_passes_gca', 'dead_passes_gca', 'take_ons_gca', 'shots_gca', 'fouls_drawn_gca', 'def_gca'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createDefensiveActionsTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called defensive_actions.csv with columns:
    player_name, team, tackles, tackles_won, defensive_third_tackles, middle_third_tackles, attacking_third_tackles,
    dribblers_tackled, dribblers_challenged, dribblers_tackled_percent, challenges_lost, blocks, shots_blocked,
    passses_blocked, interceptions, tackles_and_interceptions, clearances, shot_leading_errors
    Reads every CSV in tables/defensive_actions/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    def_dir = os.path.join(base_dir, 'defensive_actions')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'defensive_actions.csv')

    all_rows = []
    for def_file in os.listdir(def_dir):
        if not def_file.endswith('.csv'):
            continue
        team_key = def_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        def_path = os.path.join(def_dir, def_file)
        def_df = pd.read_csv(def_path)
        for _, row in def_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'tackles': row.get('tackles', ''),
                'tackles_won': row.get('tackles_won', ''),
                'defensive_third_tackles': row.get('defensive_third_tackles', ''),
                'middle_third_tackles': row.get('middle_third_tackles', ''),
                'attacking_third_tackles': row.get('attacking_third_tackles', ''),
                'dribblers_tackled': row.get('dribblers_tackled', ''),
                'dribblers_challenged': row.get('dribblers_challenged', ''),
                'dribblers_tackled_percent': row.get('dribblers_tackled_percent', ''),
                'challenges_lost': row.get('challenges_lost', ''),
                'blocks': row.get('blocks', ''),
                'shots_blocked': row.get('shots_blocked', ''),
                'passses_blocked': row.get('passses_blocked', ''),
                'interceptions': row.get('interceptions', ''),
                'tackles_and_interceptions': row.get('tackles_and_interceptions', ''),
                'clearances': row.get('clearances', ''),
                'shot_leading_errors': row.get('shot_leading_errors', '')
            })
    columns = [
        'player_name', 'team', 'tackles', 'tackles_won', 'defensive_third_tackles', 'middle_third_tackles',
        'attacking_third_tackles', 'dribblers_tackled', 'dribblers_challenged', 'dribblers_tackled_percent',
        'challenges_lost', 'blocks', 'shots_blocked', 'passses_blocked', 'interceptions', 'tackles_and_interceptions',
        'clearances', 'shot_leading_errors'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createPossessionTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called possession.csv with columns:
    player_name, team, touches, touches_in_def_pen_area, touches_in_def_third, touches_in_mid_third, touches_in_att_third,
    touches_in_att_pen_area, live_ball_touches, attempted_take_ons, successful_take_ons, successful_take_ons_percent,
    tackled_during_take_on, tackled_during_take_on_percent, carries, total_carrying_distance, progressive_carrying_distance,
    progressive_carries, carries_into_final_third, carries_into_pen_area, miscontrols, times_dispossessed, passes_received,
    progressive_passes_received
    Reads every CSV in tables/possession/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    possession_dir = os.path.join(base_dir, 'possession')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'possession.csv')

    all_rows = []
    for pos_file in os.listdir(possession_dir):
        if not pos_file.endswith('.csv'):
            continue
        team_key = pos_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        pos_path = os.path.join(possession_dir, pos_file)
        pos_df = pd.read_csv(pos_path)
        for _, row in pos_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'touches': row.get('touches', ''),
                'touches_in_def_pen_area': row.get('touches_in_def_pen_area', ''),
                'touches_in_def_third': row.get('touches_in_def_third', ''),
                'touches_in_mid_third': row.get('touches_in_mid_third', ''),
                'touches_in_att_third': row.get('touches_in_att_third', ''),
                'touches_in_att_pen_area': row.get('touches_in_att_pen_area', ''),
                'live_ball_touches': row.get('live_ball_touches', ''),
                'attempted_take_ons': row.get('attempted_take_ons', ''),
                'successful_take_ons': row.get('successful_take_ons', ''),
                'successful_take_ons_percent': row.get('successful_take_ons_percent', ''),
                'tackled_during_take_on': row.get('tackled_during_take_on', ''),
                'tackled_during_take_on_percent': row.get('tackled_during_take_on_percent', ''),
                'carries': row.get('carries', ''),
                'total_carrying_distance': row.get('total_carrying_distance', ''),
                'progressive_carrying_distance': row.get('progressive_carrying_distance', ''),
                'progressive_carries': row.get('progressive_carries', ''),
                'carries_into_final_third': row.get('carries_into_final_third', ''),
                'carries_into_pen_area': row.get('carries_into_pen_area', ''),
                'miscontrols': row.get('miscontrols', ''),
                'times_dispossessed': row.get('times_dispossessed', ''),
                'passes_received': row.get('passes_received', ''),
                'progressive_passes_received': row.get('progressive_passes_received', '')
            })
    columns = [
        'player_name', 'team', 'touches', 'touches_in_def_pen_area', 'touches_in_def_third', 'touches_in_mid_third',
        'touches_in_att_third', 'touches_in_att_pen_area', 'live_ball_touches', 'attempted_take_ons', 'successful_take_ons',
        'successful_take_ons_percent', 'tackled_during_take_on', 'tackled_during_take_on_percent', 'carries',
        'total_carrying_distance', 'progressive_carrying_distance', 'progressive_carries', 'carries_into_final_third',
        'carries_into_pen_area', 'miscontrols', 'times_dispossessed', 'passes_received', 'progressive_passes_received'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createPlayingTimeTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called playing_time.csv with columns:
    player_name, team, matches_played, minutes_played, minutes_per_match, percent_of_squad_mins_played, 90s_played, starts,
    minutes_per_start, complete_matches_played, sub_appearances, minutes_per_sub, matches_as_unused_sub, points_per_match,
    goals_scored_by_team_while_on_pitch, goals_allowed_by_team_while_on_pitch, goals_scored_goals_allowed_while_on_pitch_diff,
    goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played,
    net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety,
    team_xG_while_on_pitch, team_xGA_while_on_pitch, team_xGdiff_while_on_pitch, team_xGdiff_while_on_pitch_per_ninety,
    team_xG_plus_minus_net_diff_while_on_pitch
    Reads every CSV in tables/playing_time/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    playing_time_dir = os.path.join(base_dir, 'playing_time')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'playing_time.csv')

    all_rows = []
    for pt_file in os.listdir(playing_time_dir):
        if not pt_file.endswith('.csv'):
            continue
        team_key = pt_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        pt_path = os.path.join(playing_time_dir, pt_file)
        pt_df = pd.read_csv(pt_path)
        for _, row in pt_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'matches_played': row.get('matches_played', ''),
                'minutes_played': row.get('minutes_played', ''),
                'minutes_per_match': row.get('minutes_per_match', ''),
                'percent_of_squad_mins_played': row.get('percent_of_squad_mins_played', ''),
                '90s_played': row.get('90s_played', ''),
                'starts': row.get('starts', ''),
                'minutes_per_start': row.get('minutes_per_start', ''),
                'complete_matches_played': row.get('complete_matches_played', ''),
                'sub_appearances': row.get('sub_appearances', ''),
                'minutes_per_sub': row.get('minutes_per_sub', ''),
                'matches_as_unused_sub': row.get('matches_as_unused_sub', ''),
                'points_per_match': row.get('points_per_match', ''),
                'goals_scored_by_team_while_on_pitch': row.get('goals_scored_by_team_while_on_pitch', ''),
                'goals_allowed_by_team_while_on_pitch': row.get('goals_allowed_by_team_while_on_pitch', ''),
                'goals_scored_goals_allowed_while_on_pitch_diff': row.get('goals_scored_goals_allowed_while_on_pitch_diff', ''),
                'goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played': row.get('goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played', ''),
                'net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety': row.get('net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety', ''),
                'team_xG_while_on_pitch': row.get('team_xG_while_on_pitch', ''),
                'team_xGA_while_on_pitch': row.get('team_xGA_while_on_pitch', ''),
                'team_xGdiff_while_on_pitch': row.get('team_xGdiff_while_on_pitch', ''),
                'team_xGdiff_while_on_pitch_per_ninety': row.get('team_xGdiff_while_on_pitch_per_ninety', ''),
                'team_xG_plus_minus_net_diff_while_on_pitch': row.get('team_xG_plus_minus_net_diff_while_on_pitch', '')
            })
    columns = [
        'player_name', 'team', 'matches_played', 'minutes_played', 'minutes_per_match', 'percent_of_squad_mins_played',
        '90s_played', 'starts', 'minutes_per_start', 'complete_matches_played', 'sub_appearances', 'minutes_per_sub',
        'matches_as_unused_sub', 'points_per_match', 'goals_scored_by_team_while_on_pitch',
        'goals_allowed_by_team_while_on_pitch', 'goals_scored_goals_allowed_while_on_pitch_diff',
        'goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played',
        'net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety',
        'team_xG_while_on_pitch', 'team_xGA_while_on_pitch', 'team_xGdiff_while_on_pitch',
        'team_xGdiff_while_on_pitch_per_ninety', 'team_xG_plus_minus_net_diff_while_on_pitch'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")

def createMiscStatsTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called misc_stats.csv with columns:
    player_name, team, yellow_cards, red_cards, second_yellow_cards, fouls_commited, fouls_drawn, offsides, pk_won, pk_conceded,
    own_goals, ball_recoveries, aerial_duels_won, aerial_duels_lost, aerial_duels_won_percent
    Reads every CSV in tables/misc_stats/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'tables')
    misc_stats_dir = os.path.join(base_dir, 'misc_stats')
    output_dir = os.path.join(os.path.dirname(__file__), '.', 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'misc_stats.csv')

    all_rows = []
    for misc_file in os.listdir(misc_stats_dir):
        if not misc_file.endswith('.csv'):
            continue
        team_key = misc_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        misc_path = os.path.join(misc_stats_dir, misc_file)
        misc_df = pd.read_csv(misc_path)
        for _, row in misc_df.iterrows():
            if pd.isnull(row['player']) or str(row['player']).strip().lower() == 'player':
                continue
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'yellow_cards': row.get('yellow_cards', ''),
                'red_cards': row.get('red_cards', ''),
                'second_yellow_cards': row.get('second_yellow_cards', ''),
                'fouls_commited': row.get('fouls_commited', ''),
                'fouls_drawn': row.get('fouls_drawn', ''),
                'offsides': row.get('offsides', ''),
                'pk_won': row.get('pk_won', ''),
                'pk_conceded': row.get('pk_conceded', ''),
                'own_goals': row.get('own_goals', ''),
                'ball_recoveries': row.get('ball_recoveries', ''),
                'aerial_duels_won': row.get('aerial_duels_won', ''),
                'aerial_duels_lost': row.get('aerial_duels_lost', ''),
                'aerial_duels_won_percent': row.get('aerial_duels_won_percent', '')
            })
    columns = [
        'player_name', 'team', 'yellow_cards', 'red_cards', 'second_yellow_cards', 'fouls_commited', 'fouls_drawn',
        'offsides', 'pk_won', 'pk_conceded', 'own_goals', 'ball_recoveries', 'aerial_duels_won', 'aerial_duels_lost',
        'aerial_duels_won_percent'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")
