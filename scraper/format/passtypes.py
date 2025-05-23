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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    pass_types_dir = os.path.join(base_dir, 'pass_types')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
