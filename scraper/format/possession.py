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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    possession_dir = os.path.join(base_dir, 'possession')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
