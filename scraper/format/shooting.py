import os
import pandas as pd

def createShootingTable(base_dir=None):
    """
    Creates a CSV file in formatted_tables/ called shooting.csv with columns:
    player_name, team, total_shots, shots_on_target, shots_on_target_percent, shots_per_90, shots_on_target_per_90,
    goals_per_shot, goals_per_shot_on_target, average_shot_distance, shots_from_fks, pk_scored, pk_attempted, xg, npxg,
    npxg_per_shot, goals_xg_diff, np_goals_npxg_diff, goals, non_pk_goals
    """
    import os
    import pandas as pd
    import numpy as np

    # Set up paths
    if base_dir is None:
        # Print current directory for debugging
        print(f"Current directory: {os.getcwd()}")
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'raw_tables'))
        print(f"Using base directory: {base_dir}")
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    shooting_dir = os.path.join(base_dir, 'shooting')
    player_summaries_dir = os.path.join(base_dir, 'player_summaries')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
            # Map source columns to our desired output columns
            all_rows.append({
                'player_name': row['player'],
                'team': team_name,
                'total_shots': row['total_shots'],
                'shots_on_target': row['shots_on_target'],
                'shots_on_target_percent': row['shots_on_target_percent'],
                'shots_per_90': row['shots_per_90'],
                'shots_on_target_per_90': row['shots_on_target_per_90'],
                'goals_per_shot': row['goals_per_shot'],
                'goals_per_shot_on_target': row['goals_per_shot_on_target'],
                'average_shot_distance': row['average_shot_distance'],
                'shots_from_fks': row['shots_from_fks'],
                'pk_scored': row['pk_scored'],
                'pk_attempted': row['pk_attempted'],
                'xg': row['xG'],  # Note the capital G in the source
                'npxg': row['npxG'],  # Note the capital G in the source
                'npxg_per_shot': row['npxG_per_shot'],  # Note the capital G in the source
                'goals_xg_diff': row['goals_xG_diff'],  # Note the capital G in the source
                'np_goals_npxg_diff': row['np_goals_npxG_diff'],  # Note the capital G in the source
                'goals': row['goals'],
                'non_pk_goals': row.get('non_pk_goals', '')  # This still comes from player_summaries
            })
    columns = [
        'player_name', 'team', 'total_shots', 'shots_on_target', 'shots_on_target_percent', 'shots_per_90',
        'shots_on_target_per_90', 'goals_per_shot', 'goals_per_shot_on_target', 'average_shot_distance',
        'shots_from_fks', 'pk_scored', 'pk_attempted', 'xg', 'npxg', 'npxg_per_shot', 'goals_xg_diff',
        'np_goals_npxg_diff', 'goals', 'non_pk_goals'
    ]
    out_df = pd.DataFrame(all_rows, columns=columns)
    out_df.to_csv(output_path, index=False)
    print(f"Created {output_path} with {len(out_df)} rows.")
