import React, { useState, useMemo } from "react";
import Accordion from "react-bootstrap/Accordion";
import { PlayerCard } from "../components/compare/player_card";
import { CompareRow } from "../components/shared/StatRow";
import { useCompareData } from "../hooks/usePlayerData";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { STAT_SECTIONS } from "../data/stat_sections";

const API_BASE = process.env.REACT_APP_API_BASE ||
  `${window.location.protocol}//${window.location.host}/api`;

const calculatePer90 = (value, minutes) => {
  const mins = Number(minutes || 0);
  if (mins === 0) return null;
  const ninetyMins = mins / 90;
  return (Number(value || 0) / ninetyMins).toFixed(2);
};

const calculateStat = (statDef, row, minutes) => {
  if (statDef.calculated) {
    const data = row || {};
    switch (statDef.key) {
      case "goals_xg_diff":
        return Number(data.goals || 0) - Number(data.xg || 0);
      case "np_goals_npxg_diff":
        return Number(data.np_goals || 0) - Number(data.np_xg || 0);
      case "goals_per_shot":
        return Number(data.shots || 0) > 0
          ? (Number(data.goals || 0) / Number(data.shots)).toFixed(2)
          : null;
      case "npxg_per_shot":
        return Number(data.shots || 0) > 0
          ? (Number(data.np_xg || 0) / Number(data.shots)).toFixed(3)
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
        return total > 0 ? ((saves / total) * 100).toFixed(1) : null;
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
          <Accordion defaultActiveKey={["0", isP1GK || isP2GK ? "keepers" : "offensive"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
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
              </Accordion.Body>
            </Accordion.Item>

            {(isP1GK || isP2GK) && (
              <Accordion.Item eventKey="keepers">
                <Accordion.Header className="accordion-header">Goalkeeping Stats</Accordion.Header>
                <Accordion.Body className="accordion-body bg-white">
                  <div className="flex flex-col gap-1">
                    {STAT_SECTIONS.keepers.fields.map((field) => (
                      <CompareRow
                        key={field.key}
                        label={field.label}
                        p1Value={calculateStat(field, p1Data.keepers?.[0], p1Minutes)}
                        p2Value={calculateStat(field, p2Data.keepers?.[0], p2Minutes)}
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
                    <CompareRow
                      key={field.key}
                      label={field.label}
                      p1Value={calculateStat(field, p1Data.offensive?.[0], p1Minutes)}
                      p2Value={calculateStat(field, p2Data.offensive?.[0], p2Minutes)}
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
                    <CompareRow
                      key={field.key}
                      label={field.label}
                      p1Value={calculateStat(field, p1Data.defensive?.[0], p1Minutes)}
                      p2Value={calculateStat(field, p2Data.defensive?.[0], p2Minutes)}
                      unit={field.unit}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </div>
  );
};
