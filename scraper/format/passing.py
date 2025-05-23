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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    passing_dir = os.path.join(base_dir, 'passing')
    player_summaries_dir = os.path.join(base_dir, 'player_summaries')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
                'xag': row.get('xAG', ''),
                'xa': row.get('xA', ''),
                'assist_xag_diff': row.get('assist_xAG_diff', ''),
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
        'long_pass_completion_percentage', 'assists', 'xag', 'xa', 'assist_xag_diff', 'key_passes',
        'passes_into_final_third', 'passes_into_penalty_area', 'crosses_into_penalty_area', 'progressive_passes',
        'assists_from_summary'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")
