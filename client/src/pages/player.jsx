import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/Radar";
import { PlayerProfileCard } from "../components/player/PlayerProfileCard";
import { StatRow } from "../components/shared/StatRow";
import { usePlayerData } from "../hooks/usePlayerData";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
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

const PositionRadarItem = ({ positionStats, position }) => {
  if (!positionStats[position]) return null;
  
  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-base md:text-lg text-premier-dark font-bold">
        {POSITION_LABELS[position]}
      </h3>
      <PlayerRadar stats={positionStats[position]} position={position} />
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
          <PositionRadarItem positionStats={positionStats} position="GK" />
          <PositionRadarItem positionStats={positionStats} position="DF" />
          <PositionRadarItem positionStats={positionStats} position="MF" />
          <PositionRadarItem positionStats={positionStats} position="FW" />
        </div>

        <Divider />
      </div>

      <div className="w-full px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto w-full">
          <Accordion defaultActiveKey={["0", isGK ? "keepers" : "offensive"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                <div className="flex flex-col gap-1">
                  {overviewFields.map((field) => (
                    <StatRow
                      key={field.key}
                      label={field.label}
                      value={playerData?.[field.key]}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {isGK && (
              <Accordion.Item eventKey="keepers">
                <Accordion.Header className="accordion-header">Goalkeeping Stats</Accordion.Header>
                <Accordion.Body className="accordion-body bg-white">
                  <div className="flex flex-col gap-1">
                    {STAT_SECTIONS.keepers.fields.map((field) => (
                      <StatRow
                        key={field.key}
                        label={field.label}
                        value={calculateStat(field, playerStats.keepers?.[0], minutes)}
                        unit={field.unit}
                      />
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )}

            <Accordion.Item eventKey="offensive">
              <Accordion.Header className="accordion-header">Offensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                <div className="flex flex-col gap-1">
                  {STAT_SECTIONS.offensive.fields.map((field) => (
                    <StatRow
                      key={field.key}
                      label={field.label}
                      value={calculateStat(field, playerStats.offensive?.[0], minutes)}
                      unit={field.unit}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="defensive">
              <Accordion.Header className="accordion-header">Defensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                <div className="flex flex-col gap-1">
                  {STAT_SECTIONS.defensive.fields.map((field) => (
                    <StatRow
                      key={field.key}
                      label={field.label}
                      value={calculateStat(field, playerStats.defensive?.[0], minutes)}
                      unit={field.unit}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
