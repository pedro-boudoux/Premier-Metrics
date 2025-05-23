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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    gs_conversion_dir = os.path.join(base_dir, 'goal_and_shot_creation')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'goal_and_shot_conversion.csv')

    all_rows = []
    for gsc_file in os.listdir(gs_conversion_dir):
        if not gsc_file.endswith('.csv'):
            continue
        team_key = gsc_file.split('-')[0]
        team_name = team_key.replace('_', ' ')
        gsc_path = os.path.join(gs_conversion_dir, gsc_file)
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
