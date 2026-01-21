/**
 * Radar chart configuration for different player positions
 * Contains stat keys, labels, ranges, and colors for each position
 */

export const RADAR_CONFIG = {
  GK: {
    labels: ['Goals Prevented', 'Clean Sheets', 'Recoveries/90', 'Long Balls Acc./90', 'Goals Conceded/90', 'Saves/90'],
    keys: ['goals_prevented', 'clean_sheets', 'recoveries_p90', 'long_balls_accurate_p90', 'goals_conceded_p90', 'saves_p90'],
    ranges: {
      goals_prevented: [-3, 3],
      clean_sheets: [0, 15],
      recoveries_p90: [0, 2],
      long_balls_accurate_p90: [0, 3],
      goals_conceded_p90: [0.5, 2.5],
      saves_p90: [1, 5],
    },
    colors: {
      bg: 'rgba(109, 255, 99, 0.2)',
      border: 'rgba(0, 101, 3, 1)',
    },
    label: 'Goalkeeper Stats'
  },

  DF: {
    labels: ['Tackles Won/90', 'Interceptions/90', 'Duels Won/90', 'Goals/90', 'xG/90', 'Goals - xG'],
    keys: ['tackles_won_p90', 'interceptions_p90', 'duels_won_p90', 'goals_p90', 'xg_p90', 'goals_xg_diff'],
    ranges: {
      tackles_won_p90: [0, 4],
      interceptions_p90: [0, 3],
      duels_won_p90: [0, 6],
      goals_p90: [0, 0.3],
      xg_p90: [0, 0.2],
      goals_xg_diff: [-3, 3],
    },
    colors: {
      bg: 'rgba(255, 99, 99, 0.2)',
      border: 'rgba(157, 1, 1, 1)',
    },
    label: 'Defender Stats'
  },

  MF: {
    labels: ['Goals/90', 'xG/90', 'Goals - xG', 'Tackles Won/90', 'Interceptions/90', 'Duels Won/90'],
    keys: ['goals_p90', 'xg_p90', 'goals_xg_diff', 'tackles_won_p90', 'interceptions_p90', 'duels_won_p90'],
    ranges: {
      goals_p90: [0, 0.5],
      xg_p90: [0, 0.4],
      goals_xg_diff: [-3, 3],
      tackles_won_p90: [0, 4],
      interceptions_p90: [0, 3],
      duels_won_p90: [0, 6],
    },
    colors: {
      bg: 'rgba(255, 200, 0, 0.2)',
      border: 'rgba(164, 148, 4, 1)',
    },
    label: 'Midfielder Stats'
  },

  FW: {
    labels: ['Goals/90', 'xG/90', 'Goals - xG', 'Tackles Won/90', 'Interceptions/90', 'Duels Won/90'],
    keys: ['goals_p90', 'xg_p90', 'goals_xg_diff', 'tackles_won_p90', 'interceptions_p90', 'duels_won_p90'],
    ranges: {
      goals_p90: [0, 1],
      xg_p90: [0, 0.6],
      goals_xg_diff: [-5, 5],
      tackles_won_p90: [0, 3],
      interceptions_p90: [0, 2],
      duels_won_p90: [0, 5],
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
