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
    { label: "Matches Played", value: playerData.matches },
    { label: "Minutes Played", value: playerData.minutes },
    { label: "Yellow Cards", value: playerData.yellow_cards },
    { label: "Red Cards", value: playerData.red_cards },
  ];

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
          <Accordion defaultActiveKey={["0", isGK ? "1" : "2"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                <div className="flex flex-col gap-1">
                  {overviewFields.map((field) => (
                    <StatRow key={field.label} label={field.label} value={field.value} />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {isGK && (
              <Accordion.Item eventKey="1">
                <Accordion.Header className="accordion-header">Goalkeeping Stats</Accordion.Header>
                <Accordion.Body className="accordion-body">
                  <div className="flex flex-col gap-4">
                    {STAT_SECTIONS.keepers.fields.map((field) => (
                      <StatRow
                        key={field.key}
                        label={field.label}
                        value={playerStats.keepers?.[0]?.[field.key]}
                        unit={field.unit}
                      />
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )}

            <Accordion.Item eventKey={isGK ? "2" : "1"}>
              <Accordion.Header className="accordion-header">Offensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {STAT_SECTIONS.offensive.fields.map((field) => (
                    <StatRow
                      key={field.key}
                      label={field.label}
                      value={playerStats.offensive?.[0]?.[field.key]}
                      unit={field.unit}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey={isGK ? "3" : "2"}>
              <Accordion.Header className="accordion-header">Defensive Stats</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {STAT_SECTIONS.defensive.fields.map((field) => (
                    <StatRow
                      key={field.key}
                      label={field.label}
                      value={playerStats.defensive?.[0]?.[field.key]}
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
