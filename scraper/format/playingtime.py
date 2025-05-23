def createPlayingTimeTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called playing_time.csv with columns:
    player_name, team, matches_played, minutes_played, minutes_per_match, percent_squad_mins, nineties_played, starts,
    minutes_per_start, complete_matches, sub_appearances, minutes_per_sub, unused_sub_matches, points_per_match,
    team_goals_for, team_goals_against, goal_diff,
    goal_diff_per_90,
    net_goal_diff_per_90,
    team_xg, team_xga, team_xg_diff, team_xg_diff_per_90,
    team_xg_plus_minus_net_diff
    Reads every CSV in tables/playing_time/ and extracts the required columns.
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    playing_time_dir = os.path.join(base_dir, 'playing_time')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
                continue            # Column mapping from source CSV to our desired output
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'matches_played': row['matches_played'],
                'minutes_played': row['minutes_played'],
                'minutes_per_match': row['minutes_per_match'],
                'percent_squad_mins': row['percent_of_squad_mins_played'],
                'nineties_played': row['90s_played'],
                'starts': row['starts'],
                'minutes_per_start': row['minutes_per_start'],
                'complete_matches': row['complete_matches_played'],
                'sub_appearances': row['sub_appearances'],
                'minutes_per_sub': row['minutes_per_sub'],
                'unused_sub_matches': row['matches_as_unused_sub'],
                'points_per_match': row['points_per_match'],                'team_goals_for': row['goals_scored_by_team_while_on_pitch'],
                'team_goals_against': row['goals_allowed_by_team_while_on_pitch'],
                'goal_diff': row['goals_scored_goals_allowed_while_on_pitch_diff'],
                'goal_diff_per_90': row['goals_scored_goals_allowed_while_on_pitch_diff_per_ninety_played'],
                'net_goal_diff_per_90': row['net_goals_scored_while_player_on_pitch_minus_net_goals_allowed_while_player_on_pitch_per_ninety'],
                'team_xg': row['team_xG_while_on_pitch'],
                'team_xga': row['team_xGA_while_on_pitch'],
                'team_xg_diff': row['team_xGdiff_while_on_pitch'],
                'team_xg_diff_per_90': row['team_xGdiff_while_on_pitch_per_ninety'],
                'team_xg_plus_minus_net_diff': row['team_xG_plus_minus_net_diff_while_on_pitch']
            })
    columns = [
        'player_name', 'team', 'matches_played', 'minutes_played', 'minutes_per_match', 'percent_squad_mins',
        'nineties_played', 'starts', 'minutes_per_start', 'complete_matches', 'sub_appearances', 'minutes_per_sub',
        'unused_sub_matches', 'points_per_match', 'team_goals_for',
        'team_goals_against', 'goal_diff',
        'goal_diff_per_90',
        'net_goal_diff_per_90',
        'team_xg', 'team_xga', 'team_xg_diff',
        'team_xg_diff_per_90', 'team_xg_plus_minus_net_diff'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")
