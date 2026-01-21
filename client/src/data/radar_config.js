/**
 * Radar chart configuration for different player positions
 * Contains stat keys, labels, ranges, and colors for each position
 */

export const RADAR_CONFIG = {
  GK: {
    labels: ['Save %', 'Goals Prevented', 'Clean Sheets/90', 'Pass Comp.', 'Saves/90', 'Goals Conceded/90'],
    keys: ['save_percent', 'goals_prevented', 'clean_sheets_per_90', 'pass_completion', 'saves_per_90', 'goals_conceded_per_90'],
    ranges: {
      save_percent: [40, 85],
      goals_prevented: [-3, 3],
      clean_sheets_per_90: [0, 0.5],
      pass_completion: [30, 80],
      saves_per_90: [1, 5],
      goals_conceded_per_90: [0.5, 2.5],
    },
    colors: {
      bg: 'rgba(109, 255, 99, 0.2)',
      border: 'rgba(0, 101, 3, 1)',
    },
    label: 'Goalkeeper Stats'
  },

  DF: {
    labels: ['Tackles/90', 'Interceptions/90', 'Duels Won/90', 'Def. Actions/90', 'Recoveries', 'Clearances/90'],
    keys: ['tackles_per_90', 'interceptions_per_90', 'duels_won_per_90', 'def_actions_per_90', 'recoveries', 'clearances_per_90'],
    ranges: {
      tackles_per_90: [0, 4],
      interceptions_per_90: [0, 3],
      duels_won_per_90: [0, 6],
      def_actions_per_90: [0, 10],
      recoveries: [50, 200],
      clearances_per_90: [0, 8],
    },
    colors: {
      bg: 'rgba(255, 99, 99, 0.2)',
      border: 'rgba(157, 1, 1, 1)',
    },
    label: 'Defender Stats'
  },

  MF: {
    labels: ['Goals/90', 'xG', 'Shots/90', 'Key Passes/90', 'Tackles/90', 'Interceptions/90'],
    keys: ['goals_per_90', 'xg_per_90', 'shots_per_90', 'key_passes_per_90', 'tackles_per_90', 'interceptions_per_90'],
    ranges: {
      goals_per_90: [0, 0.5],
      xg_per_90: [0, 0.4],
      shots_per_90: [0, 4],
      key_passes_per_90: [0, 3],
      tackles_per_90: [0, 4],
      interceptions_per_90: [0, 3],
    },
    colors: {
      bg: 'rgba(255, 200, 0, 0.2)',
      border: 'rgba(164, 148, 4, 1)',
    },
    label: 'Midfielder Stats'
  },

  FW: {
    labels: ['Goals/90', 'xG', 'Shots/90', 'Goals - xG', 'npxG', 'Shots per 90'],
    keys: ['goals_per_90', 'xg_per_90', 'shots_per_90', 'goals_minus_xg', 'npxg', 'shots_per_90'],
    ranges: {
      goals_per_90: [0, 1],
      xg_per_90: [0, 0.6],
      shots_per_90: [0, 5],
      goals_minus_xg: [-0.3, 0.3],
      npxg: [0, 20],
      shots_per_90: [0, 5],
    },
    colors: {
      bg: 'rgba(99, 120, 255, 0.34)',
      border: 'rgba(3, 73, 165, 1)',
    },
    label: 'Forward Stats'
  }
};

// Position display names
export const POSITION_LABELS = {
  GK: 'Goalkeeper Stats',
  DF: 'Defender Stats',
  MF: 'Midfielder Stats',
  FW: 'Forward Stats'
};
