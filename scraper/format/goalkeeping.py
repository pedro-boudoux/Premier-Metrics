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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    goalkeeping_dir = os.path.join(base_dir, 'goalkeeping')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    advanced_goalkeeping_dir = os.path.join(base_dir, 'advanced_goalkeeping')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'advanced_goalkeeping.csv')

    all_rows = []
    for adv_gk_file in os.listdir(advanced_goalkeeping_dir):
        if not adv_gk_file.endswith('.csv'):
            continue
        team_key = adv_gk_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        adv_gk_path = os.path.join(advanced_goalkeeping_dir, adv_gk_file)
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
