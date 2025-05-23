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
        # Go up one level from format/ to scraper/ then into raw_tables/
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'raw_tables')
    misc_stats_dir = os.path.join(base_dir, 'misc_stats')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'formatted_tables')
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
