import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/radar";
import { PlayerProfileCard } from "../components/player/PlayerProfileCard";
import { StatRow } from "../components/shared/StatRow";
import { usePlayerData } from "../hooks/usePlayerData";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import { STAT_SECTIONS } from "../data/stat_sections";
import { POSITION_LABELS } from "../data/radar_config";

// Position radar chart wrapper component
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

  // Use custom hook for all data fetching
  const { team, positionStats, playerStats } = usePlayerData(playerData);

  useEffect(() => {
    if (location.state?.playerData) {
      setPlayerData(location.state.playerData);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-12">
      <title>{playerData.full_name + " 24/25 Premier League Stats"}</title>
      
      <div className="max-w-6xl mx-auto w-full">
        <PlayerProfileCard playerData={playerData} team={team} />

        <Divider />

        {/* Position Radar Charts */}
        <div className="flex justify-around max-w-full m-0 flex-col md:flex-row gap-8 md:gap-0">
          <PositionRadarItem positionStats={positionStats} position="GK" />
          <PositionRadarItem positionStats={positionStats} position="DF" />
          <PositionRadarItem positionStats={positionStats} position="MF" />
          <PositionRadarItem positionStats={positionStats} position="FW" />
        </div>

        <Divider />
      </div>

      {/* Stats Accordion */}
      <div className="w-full px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto w-full">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            {/* Overview Section */}
            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                <div className="flex flex-col gap-1">
                  <StatRow label="Matches Played" value={playerStats.playing_time?.[0]?.matches_played} />
                  <StatRow label="Goals" value={playerStats.shooting?.[0]?.goals} />
                  <StatRow label="Assists" value={playerStats.passing?.[0]?.assists} />
                  {isGK && (
                    <>
                      <StatRow label="Clean Sheets" value={playerStats.goalkeeping?.[0]?.clean_sheets} />
                      <StatRow label="Saves" value={playerStats.goalkeeping?.[0]?.saves} />
                    </>
                  )}
                  <StatRow label="Yellow Cards" value={playerStats.misc_stats?.[0]?.yellow_cards} />
                  <StatRow label="Red Cards" value={playerStats.misc_stats?.[0]?.red_cards} />
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Dynamic Stat Sections */}
            {Object.entries(STAT_SECTIONS).map(([sectionKey, config], index) => {
              // Skip GK sections for non-GKs
              if (!isGK && (sectionKey === "goalkeeping" || sectionKey === "advanced_goalkeeping")) {
                return null;
              }

              return (
                <Accordion.Item eventKey={(index + 1).toString()} key={sectionKey}>
                  <Accordion.Header className="accordion-header">{config.title}</Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    <div className="flex flex-col gap-4">
                      {config.fields.map((field) => (
                        <StatRow
                          key={field.key}
                          label={field.label}
                          value={playerStats[config.key]?.[0]?.[field.key]}
                          unit={field.unit}
                        />
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
