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
          <Accordion defaultActiveKey={["0", isP1GK || isP2GK ? "1" : "2"]} alwaysOpen>
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
              <Accordion.Item eventKey="1">
                <Accordion.Header className="accordion-header">Goalkeeping Stats</Accordion.Header>
                <Accordion.Body className="accordion-body">
                  <div className="flex flex-col gap-4">
                    {STAT_SECTIONS.keepers.fields.map((field) => (
                      <CompareRow
                        key={field.key}
                        label={field.label}
                        p1Value={p1Data.keepers?.[0]?.[field.key]}
                        p2Value={p2Data.keepers?.[0]?.[field.key]}
                        unit={field.unit}
                      />
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )}

            <Accordion.Item eventKey={isP1GK || isP2GK ? "2" : "1"}>
              <Accordion.Header className="accordion-header">Offensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {STAT_SECTIONS.offensive.fields.map((field) => (
                    <CompareRow
                      key={field.key}
                      label={field.label}
                      p1Value={p1Data.offensive?.[0]?.[field.key]}
                      p2Value={p2Data.offensive?.[0]?.[field.key]}
                      unit={field.unit}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey={isP1GK || isP2GK ? "3" : "2"}>
              <Accordion.Header className="accordion-header">Defensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {STAT_SECTIONS.defensive.fields.map((field) => (
                    <CompareRow
                      key={field.key}
                      label={field.label}
                      p1Value={p1Data.defensive?.[0]?.[field.key]}
                      p2Value={p2Data.defensive?.[0]?.[field.key]}
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
