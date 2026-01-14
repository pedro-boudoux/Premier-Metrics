import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { PlayerCard } from "../components/compare/player_card";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { STAT_SECTIONS } from "../data/stat_sections";

const CompareRow = ({ label, p1Value, p2Value, unit = "" }) => (
  <div className="flex justify-between items-center px-1 py-2 border-b border-gray-100 last:border-0">
    <p className="w-1/3 text-left text-xs md:text-sm font-semibold text-premier-dark">
      {p1Value ?? "N/A"}{p1Value != null && p1Value !== "N/A" ? unit : ""}
    </p>
    <p className="w-1/3 text-center text-xs md:text-sm text-gray-600">{label}</p>
    <p className="w-1/3 text-right text-xs md:text-sm font-semibold text-premier-dark">
      {p2Value ?? "N/A"}{p2Value != null && p2Value !== "N/A" ? unit : ""}
    </p>
  </div>
);

export const Compare = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [p1Data, setP1Data] = useState({});
  const [p2Data, setP2Data] = useState({});

  const isP1GK = useMemo(() => player1?.positions?.split(",").some(p => p.trim() === "GK"), [player1]);
  const isP2GK = useMemo(() => player2?.positions?.split(",").some(p => p.trim() === "GK"), [player2]);

  const handlePlayerSelect = async (index, player) => {
    try {
      const teamResponse = await axios.post('https://premier-metrics.vercel.app/api/team', {
        team: player.team
      });
      const teamData = teamResponse.data[0]; // Access first item since response is an array
      const playerWithTeam = {
        ...player,
        team: {
          name: player.team,
          colors: {
            primary: teamData.team_color,
            darker: teamData.team_color_darker
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
      // Still set the player even if team colors fail
      if (index === 0) {
        setPlayer1(player);
      } else {
        setPlayer2(player);
      }
    }
  };

  React.useEffect(() => {
    const fetchPlayerData = async () => {
      if (player1) {
        try {
          const response = await axios.post(
            "https://premier-metrics.vercel.app/api/player-stats",
            {
              name: player1.full_name,
            }
          );
          setP1Data(response.data);
          console.log(`This is player 1's Data:`, response.data);
        } catch (err) {
          console.error("Player 1 error:", err.response?.data || err.message);
        }
      }

      if (player2) {
        try {
          const response = await axios.post(
            "https://premier-metrics.vercel.app/api/player-stats",
            {
              name: player2.full_name,
            }
          );
          setP2Data(response.data);
        } catch (err) {
          console.error("Player 2 error:", err.response?.data || err.message);
        }
      }
    };

    fetchPlayerData();
  }, [player1, player2]);

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

      {/*  PLAYER STATS */}

      {!(player1 || player2) && (
        <div className="flex justify-center text-gray-500 italic max-w-6xl mx-auto w-full">
          <p>Select at least 1 player.</p>
        </div>
      )}

      {(player1 || player2) && (
        <div className="max-w-6xl mx-auto w-full">
          <Accordion defaultActiveKey={["0", "9"]} alwaysOpen>

            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                {(p1Data || p2Data) && (
                  <div className="flex flex-col gap-1">
                    <CompareRow label="Matches Played" p1Value={p1Data.playing_time?.[0]?.matches_played} p2Value={p2Data.playing_time?.[0]?.matches_played} />
                    <CompareRow label="Goals" p1Value={p1Data.shooting?.[0]?.goals} p2Value={p2Data.shooting?.[0]?.goals} />
                    <CompareRow label="Assists" p1Value={p1Data.passing?.[0]?.assists} p2Value={p2Data.passing?.[0]?.assists} />

                    {/* Show GK overview stats if EITHER player is a GK */}
                    {(isP1GK || isP2GK) && (
                      <>
                        <CompareRow label="Clean Sheets" p1Value={p1Data.goalkeeping?.[0]?.clean_sheets} p2Value={p2Data.goalkeeping?.[0]?.clean_sheets} />
                        <CompareRow label="Saves" p1Value={p1Data.goalkeeping?.[0]?.saves} p2Value={p2Data.goalkeeping?.[0]?.saves} />
                      </>
                    )}

                    <CompareRow label="Yellow Cards" p1Value={p1Data.misc_stats?.[0]?.yellow_cards} p2Value={p2Data.misc_stats?.[0]?.yellow_cards} />
                    <CompareRow label="Red Cards" p1Value={p1Data.misc_stats?.[0]?.red_cards} p2Value={p2Data.misc_stats?.[0]?.red_cards} />
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
            {Object.entries(STAT_SECTIONS).map(([sectionKey, config], index) => {
              // Logic: Only show detailed GK sections if BOTH players are GKs
              if ((sectionKey === "goalkeeping" || sectionKey === "advanced_goalkeeping") && (!isP1GK || !isP2GK)) {
                return null;
              }

              // Calculate eventKey (offset by 1 because Overview is 0)
              const eventKey = (index + 1).toString();

              return (
                <Accordion.Item eventKey={eventKey} key={sectionKey}>
                  <Accordion.Header className="accordion-header">{config.title}</Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    <div className="flex flex-col gap-4">
                      {config.fields.map((field) => (
                        <CompareRow
                          key={field.key}
                          label={field.label}
                          p1Value={p1Data[config.key]?.[0]?.[field.key]}
                          p2Value={p2Data[config.key]?.[0]?.[field.key]}
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
      )}
    </div>
  );
};
