import React, { useState, useMemo } from "react";
import { PlayerCard } from "../components/compare/player_card";
import { CompareRow } from "../components/shared/StatRow";
import { useCompareData } from "../hooks/usePlayerData";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { STAT_SECTIONS } from "../data/stat_sections";

const API_BASE = process.env.REACT_APP_API_BASE ||
  `${window.location.protocol}//${window.location.host}/api`;

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
      case "assists_per_90":
        return calculatePer90(data.assists, minutes);
      case "xa_per_90":
        return calculatePer90(data.xa, minutes);
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

const StatSection = ({ title, fields, p1Data, p2Data, p1Minutes, p2Minutes }) => (
  <div className="mb-8">
    <h2 className="text-xl md:text-2xl text-premier-dark font-bold mb-4">{title}</h2>
    <div className="bg-white rounded-2xl shadow-premier p-4 md:p-6">
      {fields.map((field) => (
        <CompareRow
          key={field.key}
          label={field.label}
          p1Value={getStatValue(field, p1Data, p1Minutes)}
          p2Value={getStatValue(field, p2Data, p2Minutes)}
          unit={field.unit}
        />
      ))}
    </div>
  </div>
);

export const Compare = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const isP1GK = useMemo(() => player1?.positions?.split(",")?.some(p => p.trim() === "GK"), [player1]);
  const isP2GK = useMemo(() => player2?.positions?.split(",")?.some(p => p.trim() === "GK"), [player2]);

  const { p1Data, p2Data } = useCompareData(player1, player2);

  const handlePlayerSelect = async (index, player) => {
    try {
      const teamResponse = await axios.post(`${API_BASE}/team`, {
        team: player.team
      });
      const teamData = teamResponse.data[0];
      const playerWithTeam = {
        ...player,
        team: {
          name: player.team,
          nickname: teamData?.nickname || null,
          colors: {
            primary: teamData?.team_color || '#37003c',
            darker: teamData?.team_color_darker || '#241d2d'
          }
        }
      };

      if (index === 0) {
        setPlayer1(playerWithTeam);
      } else {
        setPlayer2(playerWithTeam);
      }
    } catch (error) {
      console.error("Error fetching team colors:", error);
      if (index === 0) {
        setPlayer1(player);
      } else {
        setPlayer2(player);
      }
    }
  };

  const overviewFields = [
    { label: "Matches Played", p1Key: "matches", p2Key: "matches" },
    { label: "Minutes Played", p1Key: "minutes", p2Key: "minutes" },
    { label: "Yellow Cards", p1Key: "yellow_cards", p2Key: "yellow_cards" },
    { label: "Red Cards", p1Key: "red_cards", p2Key: "red_cards" },
  ];

  const p1Minutes = player1?.minutes;
  const p2Minutes = player2?.minutes;

  return (
    <div className="flex flex-col gap-8 md:gap-12 w-full px-4 md:px-8 py-8 md:py-12">
      <title>
        {player1?.full_name && player2?.full_name
          ? `${player1.full_name} v.s. ${player2.full_name}`
          : "Head to Head Player Comparison"}
      </title>

      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl text-premier-dark font-bold">Player Comparison</h1>
        <p className="text-base md:text-lg text-gray-500">Head-to-head player comparison.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center max-w-6xl mx-auto w-full">
        <div className="w-full">
          <PlayerCard
            onSelect={(player) => handlePlayerSelect(0, player)}
            selectedPlayer={player1}
          />
        </div>
        <div className="w-full">
          <PlayerCard
            onSelect={(player) => handlePlayerSelect(1, player)}
            selectedPlayer={player2}
          />
        </div>
      </div>

      {!(player1 || player2) && (
        <div className="flex justify-center text-gray-500 italic max-w-6xl mx-auto w-full">
          <p>Select at least 1 player.</p>
        </div>
      )}

      {(player1 || player2) && (
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col gap-6">
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl text-premier-dark font-bold mb-4">Overview</h2>
              <div className="bg-white rounded-2xl shadow-premier p-4 md:p-6">
                {(p1Data || p2Data) && (
                  <div className="flex flex-col gap-1">
                    {overviewFields.map((field) => (
                      <CompareRow
                        key={field.label}
                        label={field.label}
                        p1Value={player1?.[field.p1Key]}
                        p2Value={player2?.[field.p2Key]}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(isP1GK || isP2GK) && (
              <StatSection
                title="Goalkeeping Stats"
                fields={STAT_SECTIONS.keepers.fields}
                p1Data={p1Data.keepers?.[0]}
                p2Data={p2Data.keepers?.[0]}
                p1Minutes={p1Minutes}
                p2Minutes={p2Minutes}
              />
            )}

            <StatSection
              title="Offensive Stats"
              fields={STAT_SECTIONS.offensive.fields}
              p1Data={p1Data.offensive?.[0]}
              p2Data={p2Data.offensive?.[0]}
              p1Minutes={p1Minutes}
              p2Minutes={p2Minutes}
            />

            <StatSection
              title="Defensive Stats"
              fields={STAT_SECTIONS.defensive.fields}
              p1Data={p1Data.defensive?.[0]}
              p2Data={p2Data.defensive?.[0]}
              p1Minutes={p1Minutes}
              p2Minutes={p2Minutes}
            />
          </div>
        </div>
      )}
    </div>
  );
};
