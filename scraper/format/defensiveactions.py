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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    defensive_actions_dir = os.path.join(base_dir, 'defensive_actions')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'defensive_actions.csv')

    all_rows = []
    for def_file in os.listdir(defensive_actions_dir):
        if not def_file.endswith('.csv'):
            continue
        team_key = def_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        def_path = os.path.join(defensive_actions_dir, def_file)
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