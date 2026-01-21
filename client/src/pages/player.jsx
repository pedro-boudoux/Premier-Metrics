import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/Radar";
import { PlayerProfileCard } from "../components/player/PlayerProfileCard";
import { StatRow } from "../components/shared/StatRow";
import { usePlayerData } from "../hooks/usePlayerData";
import "bootstrap/dist/css/bootstrap.min.css";
import { STAT_SECTIONS } from "../data/stat_sections";
import { POSITION_LABELS } from "../data/radar_config";

const formatFloat = (value) => {
  const num = Number(value);
  if (num === null || num === undefined || isNaN(num)) return null;
  return num.toFixed(2);
};

const calculatePer90 = (value, minutes) => {
  const mins = Number(minutes || 0);
  if (mins === 0) return null;
  const ninetyMins = mins / 90;
  return formatFloat(Number(value || 0) / ninetyMins);
};

const calculateStat = (statDef, row, minutes) => {
  if (statDef.calculated) {
    const data = row || {};
    switch (statDef.key) {
      case "goals_xg_diff":
        return formatFloat(Number(data.goals || 0) - Number(data.xg || 0));
      case "np_goals_npxg_diff":
        return formatFloat(Number(data.np_goals || 0) - Number(data.np_xg || 0));
      case "goals_per_shot":
        return Number(data.shots || 0) > 0
          ? formatFloat(Number(data.goals || 0) / Number(data.shots))
          : null;
      case "npxg_per_shot":
        return Number(data.shots || 0) > 0
          ? formatFloat(Number(data.np_xg || 0) / Number(data.shots))
          : null;
      case "total_def_actions":
        return (
          Number(data.tackles_won || 0) +
          Number(data.interceptions || 0) +
          Number(data.duels_won || 0)
        );
      case "save_percent":
        const saves = Number(data.saves || 0);
        const goalsConceded = Number(data.goals_conceded || 0);
        const total = saves + goalsConceded;
        return total > 0 ? formatFloat((saves / total) * 100) : null;
      case "goals_per_90":
        return calculatePer90(data.goals, minutes);
      case "xg_per_90":
        return calculatePer90(data.xg, minutes);
      case "shots_per_90":
        return calculatePer90(data.shots, minutes);
      case "tackles_per_90":
        return calculatePer90(data.tackles_won, minutes);
      case "interceptions_per_90":
        return calculatePer90(data.interceptions, minutes);
      case "duels_won_per_90":
        return calculatePer90(data.duels_won, minutes);
      case "def_actions_per_90":
        const totalDef = Number(data.tackles_won || 0) + Number(data.interceptions || 0) + Number(data.duels_won || 0);
        return calculatePer90(totalDef, minutes);
      case "saves_per_90":
        return calculatePer90(data.saves, minutes);
      case "goals_conceded_per_90":
        return calculatePer90(data.goals_conceded, minutes);
      default:
        return null;
    }
  }
  return row?.[statDef.key];
};

const getStatValue = (statDef, row, minutes) => {
  if (statDef.calculated) {
    return calculateStat(statDef, row, minutes);
  }
  const rawValue = row?.[statDef.key];
  return statDef.float ? formatFloat(rawValue) : rawValue;
};

const StatSection = ({ title, fields, data, minutes }) => (
  <div className="mb-8">
    <h2 className="text-xl md:text-2xl text-premier-dark font-bold mb-4">{title}</h2>
    <div className="bg-white rounded-2xl shadow-premier p-4 md:p-6">
      {fields.map((field) => (
        <StatRow
          key={field.key}
          label={field.label}
          value={getStatValue(field, data, minutes)}
          unit={field.unit}
        />
      ))}
    </div>
  </div>
);

const POSITION_MAP = {
  'F': 'FW',
  'M': 'MF',
  'D': 'DF',
  'GK': 'GK'
};

const PositionRadarItem = ({ positionStats, position }) => {
  const mappedPosition = POSITION_MAP[position] || position;
  if (!positionStats[mappedPosition]) return null;
  
  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-base md:text-lg text-premier-dark font-bold">
        {POSITION_LABELS[mappedPosition]}
      </h3>
      <PlayerRadar stats={positionStats[mappedPosition]} position={mappedPosition} />
    </div>
  );
};

export const Player = () => {
  const location = useLocation();
  const [playerData, setPlayerData] = useState({});

  const isGK = playerData?.positions?.split(",").some(p => p.trim() === "GK");

  const { team, positionStats, playerStats } = usePlayerData(playerData);

  useEffect(() => {
    if (location.state?.playerData) {
      setPlayerData(location.state.playerData);
    }
  }, [location.state]);

  const overviewFields = [
    { label: "Matches Played", key: "matches" },
    { label: "Minutes Played", key: "minutes" },
    { label: "Yellow Cards", key: "yellow_cards" },
    { label: "Red Cards", key: "red_cards" },
  ];

  const minutes = playerData?.minutes;

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-12">
      <title>{playerData.full_name + " 24/25 Premier League Stats"}</title>
      
      <div className="max-w-6xl mx-auto w-full">
        <PlayerProfileCard playerData={playerData} team={team} />

        <Divider />

        <div className="flex justify-around max-w-full m-0 flex-col md:flex-row gap-8 md:gap-0">
          {playerData.positions?.split(",").map(p => p.trim()).map(position => (
            <PositionRadarItem key={position} positionStats={positionStats} position={position} />
          ))}
        </div>

        <Divider />

        <div className="flex flex-col gap-6">
          <div className="mb-8">
            <h2 className="text-xl mt-4 md:text-2xl text-premier-dark font-bold mb-4">Overview</h2>
            <div className="bg-white rounded-2xl shadow-premier p-4 md:p-6">
              {overviewFields.map((field) => (
                <StatRow
                  key={field.key}
                  label={field.label}
                  value={playerData?.[field.key]}
                />
              ))}
            </div>
          </div>

          {isGK && (
            <StatSection
              title="Goalkeeping Stats"
              fields={STAT_SECTIONS.keepers.fields}
              data={playerStats.keepers?.[0]}
              minutes={minutes}
            />
          )}

          <StatSection
            title="Offensive Stats"
            fields={STAT_SECTIONS.offensive.fields}
            data={playerStats.offensive?.[0]}
            minutes={minutes}
          />

          <StatSection
            title="Defensive Stats"
            fields={STAT_SECTIONS.defensive.fields}
            data={playerStats.defensive?.[0]}
            minutes={minutes}
          />
        </div>
      </div>
    </div>
  );
};
