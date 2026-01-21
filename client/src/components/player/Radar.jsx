import React from "react";
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
import { RADAR_CONFIG } from '../../data/radar_config';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Helper: normalize value to 0–1
const normalize = (value, min, max) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const POSITION_MAP = {
  'F': 'FW',
  'M': 'MF',
  'D': 'DF',
  'GK': 'GK'
};

export const PlayerRadar = ({ stats, position }) => {
  const mappedPosition = POSITION_MAP[position] || position;
  const config = RADAR_CONFIG[mappedPosition];
  if (!config || !stats) return null;

  const rawValues = config.keys.map(key => {
    const path = key.split('.');
    let value = stats;
    for (let part of path) {
      value = value?.[part];
    }
    return value === undefined || value === null ? 0 : value;
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
  <Radar key={mappedPosition} data={data} options={options} />
</div>
  );
};
