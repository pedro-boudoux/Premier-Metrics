import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { PlayerCard } from "../components/compare/player_card";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";



export const Compare = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [p1Data, setP1Data] = useState({});
  const [p2Data, setP2Data] = useState({});

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
              {" "}
              {/* Overview */}
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                {(p1Data || p2Data) && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left text-xs md:text-sm">{p1Data.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                      <p className="w-1/3 text-center text-sm md:text-base">Matches Played</p>
                      <p className="w-1/3 text-right text-xs md:text-sm">{p2Data.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left text-xs md:text-sm">{p1Data.shooting?.[0]?.goals ?? "N/A"}</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">Goals</p>
                      <p className="w-1/3 text-right text-xs md:text-sm">{p2Data.shooting?.[0]?.goals ?? "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left text-xs md:text-sm">{p1Data.passing?.[0]?.assists ?? "N/A"}</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">Assists</p>
                      <p className="w-1/3 text-right text-xs md:text-sm">{p2Data.passing?.[0]?.assists ?? "N/A"}</p>
                    </div>

                    {(player1?.positions?.split(",").includes("GK") ||
                      player2?.positions?.split(",").includes("GK")) && (
                        <>
                          <div className="flex justify-between items-center px-1 py-1">
                            <p>
                              {p1Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                            </p>
                            <p>Clean Sheets</p>
                            <p>
                              {p2Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                            </p>
                          </div>
                          <div>
                            <p>
                              {p1Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                            </p>
                            <p>Saves</p>
                            <p>
                              {p2Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                            </p>
                          </div>
                        </>
                      )}

                    <div>
                      <p>{p1Data.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                      <p>Yellow Cards</p>
                      <p>{p2Data.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                    </div>
                    <div>
                      <p>{p1Data.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
                      <p>Red Cards</p>
                      <p>{p2Data.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              {" "}
              {/* Shooting */}
              <Accordion.Header className="accordion-header">Shooting</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.total_shots ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Shots</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.total_shots ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.shots_on_target ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots on Target</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.shots_on_target ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.shots_on_target_percent ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shot on Target %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.shots_on_target_percent ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.shots_per_90 ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots per 90</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.shots_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.shots_on_target_per_90 ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots on Target per 90</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.shots_on_target_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.goals_per_shot ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goals per Shot</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.goals_per_shot ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.goals_per_shot_on_target ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goals per Shot on Target</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.goals_per_shot_on_target ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.average_shot_distance ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Avg. Shot Distance</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.average_shot_distance ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.shots_from_fks ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots from Free Kicks</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.shots_from_fks ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.pk_scored ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Penalties Scored</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.pk_scored ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.pk_attempted ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Penalties Taken</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.pk_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.xg ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">xG</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.xg ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.npxg ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">npxG</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.npxg ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.npxg_per_shot ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">npxG per Shot</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.npxg_per_shot ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goals</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.non_pk_goals ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">non-Penalty Goals</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.non_pk_goals ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goals - xG Difference</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.shooting?.[0]?.np_goals_npxg_diff ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">npGoals - npxG Difference</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.shooting?.[0]?.np_goals_npxg_diff ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              {" "}
              {/*Goal and Shot Conversion*/}
              <Accordion.Header className="accordion-header">Goal and Shot Conversion</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.shot_creating_actions ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shot Creating Actions</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.shot_creating_actions ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.shot_creating_actions_per_90 ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shot Creating Actions per 90</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.shot_creating_actions_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.goal_creating_actions ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goal Creating Actions</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.goal_creating_actions ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.gca_per_ninety || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Goal Creating Actions per 90</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.gca_per_ninety || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.live_passes_sca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Live Ball Pass SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.live_passes_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.live_passes_gca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Live Ball Pass GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.live_passes_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.dead_passes_sca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Dead Ball Pass SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.dead_passes_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.dead_passes_gca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Dead Ball Pass GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.dead_passes_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.take_ons_sca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Take-ons SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.take_ons_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.take_ons_gca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Take-ons GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.take_ons_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.shots_sca ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.shots_sca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.shots_gca ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Shots GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.shots_gca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.fouls_drawn_sca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Fouls Drawn SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.fouls_drawn_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.fouls_drawn_gca || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Fouls Drawn GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.fouls_drawn_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.def_sca ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Defensive SCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.def_sca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goal_and_shot_conversion?.[0]?.def_gca ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Defensive GCA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goal_and_shot_conversion?.[0]?.def_gca ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              {" "}
              {/*Passing*/}
              <Accordion.Header className="accordion-header">Passing</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.total_passes_completed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Completed Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.total_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.total_passes_attempted ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Attempted Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.total_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.pass_completion_percentage ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Pass Completion %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.pass_completion_percentage ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.total_passing_distance ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Passing Distance</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.total_passing_distance ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.progressive_passing_distance || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Progressive Passing Distance</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.progressive_passing_distance || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.progressive_passes ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Progressive Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.progressive_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.short_passes_attempted ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Short Passes Attempted</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.short_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.short_passes_completed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Short Passes Completed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.short_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.short_pass_completion_percentage || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Short Passes Completion %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.short_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.medium_passes_attempted ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Medium Passes Attempted</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.medium_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.medium_passes_completed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Medium Passes Completed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.medium_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.medium_pass_completion_percentage || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Medium Passes Completion %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.medium_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.long_passes_attempted ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Long Passes Attempted</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.long_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.long_passes_completed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Long Passes Completed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.long_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.long_pass_completion_percentage || "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Long Passes Completion %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.long_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.assists ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Assists</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.assists ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.xa ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">xA</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.xa ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.xag ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">xAG</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.xag ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.assist_xag_diff ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Assists - xAG Difference</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.assist_xag_diff ?? "N/A"}</p>
                  </div>

                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.key_passes ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Key Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.key_passes ?? "N/A"}</p>
                  </div>

                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.passes_into_final_third ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Passes into Final Third</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.passes_into_final_third ?? "N/A"}</p>
                  </div>

                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.passes_into_penalty_area ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Passes into Penalty Area</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.passes_into_penalty_area ?? "N/A"}</p>
                  </div>

                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.passing?.[0]?.crosses_into_penalty_area ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Crosses into Penalty Area</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.passing?.[0]?.crosses_into_penalty_area ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="4">
              <Accordion.Header className="accordion-header">Possession</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {/* Touch Statistics */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Touches</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.live_ball_touches ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Live Ball Touches</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.live_ball_touches ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.passes_received ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Passes Received</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.passes_received ?? "N/A"}</p>
                  </div>

                  {/* Touches by Area */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches_in_def_third ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Touches in Defensive Third</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches_in_def_third ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches_in_mid_third ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Touches in Middle Third</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches_in_mid_third ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches_in_att_third ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Touches in Attacking Third</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches_in_att_third ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches_in_def_pen_area ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Touches in Defensive Penalty Area</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches_in_def_pen_area ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.touches_in_att_pen_area ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Touches in Attacking Penalty Area</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.touches_in_att_pen_area ?? "N/A"}</p>
                  </div>

                  {/* Take-on Statistics */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.attempted_take_ons ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Attempted Take-ons</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.attempted_take_ons ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.successful_take_ons ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Successful Take-ons</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.successful_take_ons ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.successful_take_ons_percent ?? "N/A"}%</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Successful Take-ons %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.successful_take_ons_percent ?? "N/A"}%</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.tackled_during_take_on ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Tackled During Take-on</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.tackled_during_take_on ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.tackled_during_take_on_percent ?? "N/A"}%</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Tackled During Take-on %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.tackled_during_take_on_percent ?? "N/A"}%</p>
                  </div>

                  {/* Carry Statistics */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.carries ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Carries</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.carries ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.total_carrying_distance ?? "N/A"}m</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Carrying Distance</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.total_carrying_distance ?? "N/A"}m</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.progressive_carries ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Progressive Carries</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.progressive_carries ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.progressive_carrying_distance ?? "N/A"}m</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Progressive Carrying Distance</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.progressive_carrying_distance ?? "N/A"}m</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.carries_into_final_third ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Carries into Final Third</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.carries_into_final_third ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.carries_into_pen_area ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Carries into Penalty Area</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.carries_into_pen_area ?? "N/A"}</p>
                  </div>

                  {/* Progressive Passes */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.progressive_passes_received ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Progressive Passes Received</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.progressive_passes_received ?? "N/A"}</p>
                  </div>

                  {/* Negative Statistics */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.miscontrols ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Miscontrols</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.miscontrols ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.possession?.[0]?.times_dispossessed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Times Dispossessed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.possession?.[0]?.times_dispossessed ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header className="accordion-header">Pass Types</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {/* Basic Pass Types */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.live_ball_passes ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Live Ball Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.live_ball_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.dead_ball_passes ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Dead Ball Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.dead_ball_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.total_passes_completed ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Total Passes Completed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.total_passes_completed ?? "N/A"}</p>
                  </div>

                  {/* Set Pieces */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.free_kick_passes ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Free Kick Passes</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.free_kick_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.throw_ins_taken ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Throw-ins Taken</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.throw_ins_taken ?? "N/A"}</p>
                  </div>

                  {/* Corner Statistics */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.corners_taken ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Corners Taken</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.corners_taken ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.inswinging_corners ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Inswinging Corners</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.inswinging_corners ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.outswinging_corners ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Outswinging Corners</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.outswinging_corners ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.straight_corners ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Straight Corners</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.straight_corners ?? "N/A"}</p>
                  </div>

                  {/* Attacking Passes */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.through_balls ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Through Balls</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.through_balls ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.crosses ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Crosses</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.crosses ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.switches ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Switches</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.switches ?? "N/A"}</p>
                  </div>

                  {/* Unsuccessful Passes */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.passes_offside ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Passes Offside</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.passes_offside ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.pass_types?.[0]?.passes_blocked ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Passes Blocked</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.pass_types?.[0]?.passes_blocked ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              {" "}
              {/*Defending*/}
              <Accordion.Header className="accordion-header">Defending</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  {/* Tackle Statistics */}
                  <div>
                    <p>{p1Data.defensive_actions?.[0]?.tackles ?? "N/A"}</p>
                    <p>Total Tackles</p>
                    <p>{p2Data.defensive_actions?.[0]?.tackles ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.defensive_actions?.[0]?.tackles_won ?? "N/A"}</p>
                    <p>Tackles Won</p>
                    <p>{p2Data.defensive_actions?.[0]?.tackles_won ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]
                        ?.tackles_and_interceptions ?? "N/A"}
                    </p>
                    <p>Tackles + Interceptions</p>
                    <p>
                      {p2Data.defensive_actions?.[0]
                        ?.tackles_and_interceptions ?? "N/A"}
                    </p>
                  </div>

                  {/* Tackles by Area */}
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.defensive_third_tackles ??
                        "N/A"}
                    </p>
                    <p>Defensive Third Tackles</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.defensive_third_tackles ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.middle_third_tackles ??
                        "N/A"}
                    </p>
                    <p>Middle Third Tackles</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.middle_third_tackles ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.attacking_third_tackles ??
                        "N/A"}
                    </p>
                    <p>Attacking Third Tackles</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.attacking_third_tackles ??
                        "N/A"}
                    </p>
                  </div>

                  {/* Dribbler Challenges */}
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.dribblers_challenged ??
                        "N/A"}
                    </p>
                    <p>Dribblers Challenged</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.dribblers_challenged ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.dribblers_tackled ??
                        "N/A"}
                    </p>
                    <p>Dribblers Tackled</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.dribblers_tackled ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]
                        ?.dribblers_tackled_percent ?? "N/A"}
                      %
                    </p>
                    <p>Dribblers Tackled %</p>
                    <p>
                      {p2Data.defensive_actions?.[0]
                        ?.dribblers_tackled_percent ?? "N/A"}
                      %
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.challenges_lost ?? "N/A"}
                    </p>
                    <p>Challenges Lost</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.challenges_lost ?? "N/A"}
                    </p>
                  </div>

                  {/* Other Defensive Actions */}
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.interceptions ?? "N/A"}
                    </p>
                    <p>Interceptions</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.interceptions ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>{p1Data.defensive_actions?.[0]?.blocks ?? "N/A"}</p>
                    <p>Total Blocks</p>
                    <p>{p2Data.defensive_actions?.[0]?.blocks ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.shots_blocked ?? "N/A"}
                    </p>
                    <p>Shots Blocked</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.shots_blocked ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.passses_blocked ?? "N/A"}
                    </p>
                    <p>Passes Blocked</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.passses_blocked ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>{p1Data.defensive_actions?.[0]?.clearances ?? "N/A"}</p>
                    <p>Clearances</p>
                    <p>{p2Data.defensive_actions?.[0]?.clearances ?? "N/A"}</p>
                  </div>

                  {/* Errors */}
                  <div>
                    <p>
                      {p1Data.defensive_actions?.[0]?.shot_leading_errors ??
                        "N/A"}
                    </p>
                    <p>Shot Leading Errors</p>
                    <p>
                      {p2Data.defensive_actions?.[0]?.shot_leading_errors ??
                        "N/A"}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              {" "}
              {/*Playing Time*/}
              <Accordion.Header className="accordion-header">Playing Time</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  {/* Basic Playing Time */}
                  <div>
                    <p>{p1Data.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                    <p>Matches Played</p>
                    <p>{p2Data.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.minutes_played ?? "N/A"}</p>
                    <p>Minutes Played</p>
                    <p>{p2Data.playing_time?.[0]?.minutes_played ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.minutes_per_match ?? "N/A"}
                    </p>
                    <p>Minutes per Match</p>
                    <p>
                      {p2Data.playing_time?.[0]?.minutes_per_match ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.percent_squad_mins ?? "N/A"}%
                    </p>
                    <p>% Squad Minutes</p>
                    <p>
                      {p2Data.playing_time?.[0]?.percent_squad_mins ?? "N/A"}%
                    </p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.nineties_played ?? "N/A"}</p>
                    <p>90s Played</p>
                    <p>{p2Data.playing_time?.[0]?.nineties_played ?? "N/A"}</p>
                  </div>

                  {/* Starting Statistics */}
                  <div>
                    <p>{p1Data.playing_time?.[0]?.starts ?? "N/A"}</p>
                    <p>Starts</p>
                    <p>{p2Data.playing_time?.[0]?.starts ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.minutes_per_start ?? "N/A"}
                    </p>
                    <p>Minutes per Start</p>
                    <p>
                      {p2Data.playing_time?.[0]?.minutes_per_start ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.complete_matches ?? "N/A"}</p>
                    <p>Complete Matches</p>
                    <p>{p2Data.playing_time?.[0]?.complete_matches ?? "N/A"}</p>
                  </div>

                  {/* Substitute Statistics */}
                  <div>
                    <p>{p1Data.playing_time?.[0]?.sub_appearances ?? "N/A"}</p>
                    <p>Sub Appearances</p>
                    <p>{p2Data.playing_time?.[0]?.sub_appearances ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.minutes_per_sub ?? "N/A"}</p>
                    <p>Minutes per Sub</p>
                    <p>{p2Data.playing_time?.[0]?.minutes_per_sub ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.unused_sub_matches ?? "N/A"}
                    </p>
                    <p>Unused Sub Matches</p>
                    <p>
                      {p2Data.playing_time?.[0]?.unused_sub_matches ?? "N/A"}
                    </p>
                  </div>

                  {/* Team Performance */}
                  <div>
                    <p>{p1Data.playing_time?.[0]?.points_per_match ?? "N/A"}</p>
                    <p>Points per Match</p>
                    <p>{p2Data.playing_time?.[0]?.points_per_match ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.team_goals_for ?? "N/A"}</p>
                    <p>Team Goals For</p>
                    <p>{p2Data.playing_time?.[0]?.team_goals_for ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.team_goals_against ?? "N/A"}
                    </p>
                    <p>Team Goals Against</p>
                    <p>
                      {p2Data.playing_time?.[0]?.team_goals_against ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.goal_diff ?? "N/A"}</p>
                    <p>Goal Difference</p>
                    <p>{p2Data.playing_time?.[0]?.goal_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.goal_diff_per_90 ?? "N/A"}</p>
                    <p>Goal Diff per 90</p>
                    <p>{p2Data.playing_time?.[0]?.goal_diff_per_90 ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.net_goal_diff_per_90 ?? "N/A"}
                    </p>
                    <p>Net Goal Diff per 90</p>
                    <p>
                      {p2Data.playing_time?.[0]?.net_goal_diff_per_90 ?? "N/A"}
                    </p>
                  </div>

                  {/* Expected Goals Team Performance */}
                  <div>
                    <p>{p1Data.playing_time?.[0]?.team_xg ?? "N/A"}</p>
                    <p>Team xG</p>
                    <p>{p2Data.playing_time?.[0]?.team_xg ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.team_xga ?? "N/A"}</p>
                    <p>Team xGA</p>
                    <p>{p2Data.playing_time?.[0]?.team_xga ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>{p1Data.playing_time?.[0]?.team_xg_diff ?? "N/A"}</p>
                    <p>Team xG Difference</p>
                    <p>{p2Data.playing_time?.[0]?.team_xg_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.team_xg_diff_per_90 ?? "N/A"}
                    </p>
                    <p>Team xG Diff per 90</p>
                    <p>
                      {p2Data.playing_time?.[0]?.team_xg_diff_per_90 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {p1Data.playing_time?.[0]?.team_xg_plus_minus_net_diff ??
                        "N/A"}
                    </p>
                    <p>Team xG +/- Net Diff</p>
                    <p>
                      {p2Data.playing_time?.[0]?.team_xg_plus_minus_net_diff ??
                        "N/A"}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header className="accordion-header">Miscellaneous</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div className="flex flex-col gap-4">
                  {/* Disciplinary */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Yellow Cards</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Red Cards</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.second_yellow_cards ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Second Yellow Cards</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.second_yellow_cards ?? "N/A"}</p>
                  </div>

                  {/* Fouls */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.fouls_commited ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Fouls Committed</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.fouls_commited ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.fouls_drawn ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Fouls Drawn</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.fouls_drawn ?? "N/A"}</p>
                  </div>

                  {/* Penalties */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.pk_won ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Penalties Won</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.pk_won ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.pk_conceded ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Penalties Conceded</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.pk_conceded ?? "N/A"}</p>
                  </div>

                  {/* Ball Recovery */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.ball_recoveries ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Ball Recoveries</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.ball_recoveries ?? "N/A"}</p>
                  </div>

                  {/* Aerial Duels */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.aerial_duels_won ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Aerial Duels Won</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.aerial_duels_won ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.aerial_duels_lost ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Aerial Duels Lost</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.aerial_duels_lost ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.aerial_duels_won_percent ?? "N/A"}%</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Aerial Duels Won %</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.aerial_duels_won_percent ?? "N/A"}%</p>
                  </div>

                  {/* Other Infractions */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.offsides ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Offsides</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.offsides ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.misc_stats?.[0]?.own_goals ?? "N/A"}</p>
                    <p className="w-1/3 text-center text-xs md:text-sm">Own Goals</p>
                    <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.misc_stats?.[0]?.own_goals ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {player1?.positions?.split(",").includes("GK") &&
              player2?.positions?.split(",").includes("GK") && (
                <>
                  <Accordion.Item eventKey="9" alwaysOpen>
                    <Accordion.Header className="accordion-header">Goalkeeping</Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.goals_against ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Goals Against</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.goals_against ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.goals_against_per_90 ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Goals Against per 90</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.goals_against_per_90 ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.shots_on_target_against ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Shots on Target Against</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.shots_on_target_against ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.saves ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Saves</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.saves ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.save_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Save %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.save_percent ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Clean Sheets</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.clean_sheets ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.clean_sheet_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Clean Sheet %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.clean_sheet_percent ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.pk_attempted ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Penalty Kicks Faced</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.pk_attempted ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.pk_allowed ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Penalty Kicks Conceded</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.pk_allowed ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.pk_saved ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Penalty Kicks Saved</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.pk_saved ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.pk_missed ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Penalty Kicks Missed</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.pk_missed ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.pk_save_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Penalty Kick Save %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.pk_save_percent ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.wins ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Wins</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.wins ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.draws ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Draws</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.draws ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.goalkeeping?.[0]?.losses ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Losses</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.goalkeeping?.[0]?.losses ?? "N/A"}</p>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="10" alwaysOpen>
                    <Accordion.Header className="accordion-header">Advanced Goalkeeping</Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div className="flex flex-col gap-4">
                        {/* Goals Against by Type */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.fk_goals_against ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Free Kick Goals Against</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.fk_goals_against ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.corner_goals_against ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Corner Goals Against</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.corner_goals_against ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.ogs_against_gk ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Own Goals Against GK</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.ogs_against_gk ?? "N/A"}</p>
                        </div>

                        {/* Post-Shot xG */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.post_shot_xg ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Post-Shot xG</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.post_shot_xg ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.post_shot_xg_per_shot_on_target ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Post-Shot xG per Shot on Target</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.post_shot_xg_per_shot_on_target ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.post_shot_xg_goals_allowed_diff ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Post-Shot xG - Goals Allowed</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.post_shot_xg_goals_allowed_diff ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.post_shot_xg_goals_allowed_p90_diff ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Post-Shot xG - Goals Allowed per 90</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.post_shot_xg_goals_allowed_p90_diff ?? "N/A"}</p>
                        </div>

                        {/* Passing Statistics */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.launched_passes_completed ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Launched Passes Completed</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.launched_passes_completed ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.launched_passes_attempted ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Launched Passes Attempted</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.launched_passes_attempted ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.pass_completion_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Pass Completion %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.pass_completion_percent ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.passes_attempted_non_goal_kick ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Passes Attempted (Non-GK)</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.passes_attempted_non_goal_kick ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.throws_attempted ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Throws Attempted</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.throws_attempted ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.non_goal_kick_launch_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Non-Goal Kick Launch %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.non_goal_kick_launch_percent ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.non_goal_kick_avg_pass_length ?? "N/A"}m</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Non-GK Avg Pass Length</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.non_goal_kick_avg_pass_length ?? "N/A"}m</p>
                        </div>

                        {/* Goal Kicks */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.goal_kicks_attempted ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Goal Kicks Attempted</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.goal_kicks_attempted ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.launched_goal_kick_percentage ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Launched Goal Kick %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.launched_goal_kick_percentage ?? "N/A"}%</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.avg_goal_kick_length ?? "N/A"}m</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Avg Goal Kick Length</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.avg_goal_kick_length ?? "N/A"}m</p>
                        </div>

                        {/* Cross Handling */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.crosses_faced ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Crosses Faced</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.crosses_faced ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.crosses_stopped ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Crosses Stopped</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.crosses_stopped ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.crosses_stopped_percent ?? "N/A"}%</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Crosses Stopped %</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.crosses_stopped_percent ?? "N/A"}%</p>
                        </div>

                        {/* Sweeper Keeper */}
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.defensive_actions_outside_pen_area ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Def. Actions Outside Area</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.defensive_actions_outside_pen_area ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.defensive_actions_outside_pen_area_per_ninety ?? "N/A"}</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Def. Actions per 90</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.defensive_actions_outside_pen_area_per_ninety ?? "N/A"}</p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-2">
                          <p className="w-1/3 text-left text-xs md:text-sm font-semibold">{p1Data.advanced_goalkeeping?.[0]?.avg_distance_of_defensive_actions ?? "N/A"}m</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">Avg Distance of Def. Actions</p>
                          <p className="w-1/3 text-right text-xs md:text-sm font-semibold">{p2Data.advanced_goalkeeping?.[0]?.avg_distance_of_defensive_actions ?? "N/A"}m</p>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              )}
          </Accordion>
        </div>
      )}
    </div>
  );
};
