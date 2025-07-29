import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Helper: normalize value to 0–1
const normalize = (value, min, max) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

// Define stat ranges for all positions
const statRanges = {
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

export const PlayerRadar = ({ stats, position }) => {
  useEffect(() => {
    console.log('Stats received:', stats);
  }, [stats]);

  const config = statRanges[position];
  if (!config || !stats) return null;

  // Get raw and normalized values
  const rawValues = config.keys.map(key => {
    const path = key.split('.');
    let value = stats;
    for (let part of path) {
      value = value?.[part];
    }
    return value;
  });

  const normalizedValues = rawValues.map((value, i) => {
    const key = config.keys[i];
    const [min, max] = config.ranges[key];
    return normalize(value, min, max);
  });

  const data = {
    labels: config.labels,
    datasets: [
      {
        label: config.label,
        data: normalizedValues,
        backgroundColor: config.colors.bg,
        borderColor: config.colors.border,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: {
        padding: 20
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          display: false,
          backdropColor: 'transparent',
        },
        grid: {
          color: '#ccc',
        },
        pointLabels: {
          color: '#000',
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const i = context.dataIndex;
            const raw = rawValues[i];
            const key = config.keys[i];
            const [min, max] = config.ranges[key];
            return `${config.labels[i]}: ${raw} (range ${min}–${max})`;
          },
        },
      },
      legend: {
        display: false,
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', height: 'auto' , }}>
  <Radar key={position} data={data} options={options} />
</div>
  );
};
