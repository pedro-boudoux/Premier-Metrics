/**
 * Radar chart configuration for different player positions
 * Contains stat keys, labels, ranges, and colors for each position
 */

export const RADAR_CONFIG = {
  GK: {
    labels: ['Save%', 'Goals Prevented', 'Clean Sheets/90', 'Crosses Stopped %', 'Pass Comp. %', 'Touches Outside Box/90'],
    keys: ['save_percent', 'goals_prevented', 'clean_sheets_per_90', 'crosses_stopped_percent', 'pass_completion_percent', 'touches_outside_box_per_90'],
    ranges: {
      save_percent: [25, 85],
      goals_prevented: [-5, 5],
      clean_sheets_per_90: [0, 0.6],
      crosses_stopped_percent: [0, 16],
      pass_completion_percent: [15, 50],
      touches_outside_box_per_90: [0, 3],
    },
    colors: {
      bg: 'rgba(109, 255, 99, 0.2)',
      border: 'rgba(0, 101, 3, 1)',
    },
    label: 'Goalkeeper Stats'
  },

  DF: {
    labels: ['Tackles & Int./90', 'Clearances/90', 'Aerial Duels Won%', 'Blocks/90', 'Pass Comp. %', 'Prog. Passes/90'],
    keys: ['tackles_and_int_per_90', 'clearances_per_90', 'aerial_duels_won_percent', 'blocks_per_90', 'pass_completion_percentage', 'progressive_passes_per_90'],
    ranges: {
      tackles_and_int_per_90: [0, 6],
      clearances_per_90: [0, 10],
      aerial_duels_won_percent: [0, 100],
      blocks_per_90: [0, 3],
      pass_completion_percentage: [40, 95],
      progressive_passes_per_90: [0, 10],
    },
    colors: {
      bg: 'rgba(255, 99, 99, 0.2)',
      border: 'rgba(157, 1, 1, 1)',
    },
    label: 'Defender Stats'
  },

  MF: {
    labels: ['Pass Comp. %', 'Key Passes/90', 'Prog. Passes/90', 'Tackles & Int./90', 'Touches in Att. 3rd/90', 'GCA/90'],
    keys: ['pass_completion_percentage', 'key_passes_per_90', 'progressive_passes_per_90', 'tackles_and_int_per_90', 'touches_in_att_third_per_90', 'gca_per_ninety'],
    ranges: {
      pass_completion_percentage: [50, 100],
      key_passes_per_90: [0, 3],
      progressive_passes_per_90: [0, 10],
      tackles_and_int_per_90: [0, 6],
      touches_in_att_third_per_90: [0, 35],
      gca_per_ninety: [0, 1.25],
    },
    colors: {
      bg: 'rgba(255, 200, 0, 0.2)',
      border: 'rgba(164, 148, 4, 1)',
    },
    label: 'Midfielder Stats'
  },

  FW: {
    labels: ['G/90', 'xG', 'Shots/90', 'Shot Acc.', 'GCA/90', 'Key Passes/90'],
    keys: ['goals_per_90', 'xG', 'shots_per_90', 'shot_accuracy', 'gca_per_ninety', 'key_passes_per_90'],
    ranges: {
      goals_per_90: [0, 1],
      xG: [0, 26],
      shots_per_90: [0, 6],
      shot_accuracy: [0, 65],
      gca_per_ninety: [0, 1.25],
      key_passes_per_90: [0, 3],
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
