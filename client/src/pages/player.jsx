import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/radar";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";

function setBackgroundGradient(teamData) {
    const card = document.querySelector(".profile-card");
    const team = teamData[0];

    console.log("Team color: " + team.team_color);
    card.style.backgroundImage = `linear-gradient(to bottom, ${team.team_color}, ${team.team_color_darker})`;
    card.style.color = 'white';
}

export const Player = () => {
    const location = useLocation();
    const [playerData, setPlayerData] = useState({});
    const [team, setTeam] = useState({});
    const [positionStats, setPositionStats] = useState({})
    const [playerStats, setPlayerStats] = useState({})

    /*
    PLAYER STRUCTURE
    "id",
    "first_name",
    "last_name",
    "nation",
    "team",
    "positions",
    "age",
    "yellow_cards",
    "red_cards",
    "full_name"
    */

  useEffect(() => {
    if (location.state?.playerData) {
        setPlayerData(location.state.playerData);
    }
}, [location.state]);


    useEffect( () => {
        const fetchTeam = async () => {
            try {
                const response = await axios.post("https://premier-metrics.vercel.app/api/team", {
                    team : playerData.team,
                })

                setTeam(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        if (playerData.team) fetchTeam();

    }, [playerData.team]);

    useEffect(() => {
        if (Array.isArray(team) && team.length > 0) {
            setBackgroundGradient(team);
        }
    }, [team]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const radar = await axios.post("https://premier-metrics.vercel.app/api/radar", {
                    playerData : playerData
                })

                setPositionStats(radar.data);
            } catch (err) {
                console.error(err);
            }
        }
        
        if (playerData.full_name) {
            fetchStats();
        }
    }, [playerData])

    useEffect(() => {
        const fetchPlayerData = async () => {
            if (playerData) {
                try {
                    const x = await axios.post("https://premier-metrics.vercel.app/api/player-stats", {
                        name: playerData.full_name,
                    });

                    console.log("THIS IS THE FETCHED PLAYER STATS:")
                    console.log(x.data);

                    setPlayerStats(x.data);
                    console.log(playerStats)
                } catch (err) {
                    console.error(err);
                }
            }

           
        }

         fetchPlayerData();
    }, /*[playerData]*/)

    return (
      

        <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-12">
            <title>{playerData.full_name + " 24/25 Premier League Stats"}</title>
        <div className="max-w-6xl mx-auto w-full">
        <div className="profile-card flex flex-col md:flex-row justify-between px-10 md:px-10 w-full h-auto md:h-[350px] items-center rounded-3xl shadow-premier gap-12 md:gap-0">
          
          <div className="flex flex-col">

            <h2 className="text-5xl md:text-6xl text-white m-0">{playerData.first_name}</h2>
            <h1 className="text-6xl md:text-7xl text-white mb-0 mt-0">{playerData.last_name}</h1>

          </div>

          <div className="flex flex-col">

            <p className="text-base md:text-lg text-white">{playerData.positions}</p>

            <p className="text-base md:text-lg text-white">  {playerData.team} <img src={"/images/compare/badges/" + playerData.team + "1.png"} alt={playerData.team} className="w-[50px] md:w-[50px] inline" /></p>

            <p className="text-base md:text-lg text-white">{playerData.nation}</p>          </div>
            
        </div>

        <Divider></Divider>

        <div className="flex justify-around max-w-full m-0 flex-col md:flex-row gap-8 md:gap-0">

            {positionStats.GK && (
                // stuff for if the player is a goalkeeper
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-base md:text-lg text-premier-dark font-bold">Goalkeeper Stats</h3>
                <PlayerRadar stats={positionStats.GK} position="GK"></PlayerRadar>
              </div>
                
            )}

            {positionStats.DF && (
                // stuff for if the player is a defender
                <div className="flex flex-col justify-center items-center">
                <h3 className="text-base md:text-lg text-premier-dark font-bold">Defender Stats</h3>
                <PlayerRadar   stats={positionStats.DF} position="DF"></PlayerRadar>
              </div>
                
            )}

            {positionStats.MF && (
                // stuff for if the player is a midfielder
                <div className="flex flex-col justify-center items-center">
                <h3 className="text-base md:text-lg text-premier-dark font-bold">Midfielder Stats</h3>
                <PlayerRadar stats={positionStats.MF} position="MF"></PlayerRadar>
              </div>
                
            )}

            {positionStats.FW && (
                // stuff for if the player is a forward
                <div className="flex flex-col justify-center items-center">
                 <h3 className="text-base md:text-lg text-premier-dark font-bold">Forward Stats</h3>
                <PlayerRadar stats={positionStats.FW} position="FW"></PlayerRadar>
              </div>
            )}

        </div>

        <Divider></Divider>
        </div>

        <div className="w-full px-4 md:px-8 py-8 md:py-12">
            <div className="max-w-6xl mx-auto w-full">
        <div>
            <Accordion defaultActiveKey={["0", "9"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              {" "}
              {/* Overview */}
              <Accordion.Header className="accordion-header text-premier-dark">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body bg-white">
                {(playerStats) && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left">Matches Played</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">{playerStats.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left">Goals</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">{playerStats.shooting?.[0]?.goals ?? "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left">Assists</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">{playerStats.passing?.[0]?.assists ?? "N/A"}</p>
                    </div>

                    {playerData?.positions?.split(",").includes("GK") && (
                      <>
                        <div className="flex justify-between items-center px-1 py-1">

                          <p className="w-1/3 text-left">Clean Sheets</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">
                            {playerStats.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center px-1 py-1">

                          <p className="w-1/3 text-left">Saves</p>
                          <p className="w-1/3 text-center text-xs md:text-sm">
                            {playerStats.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left">Yellow Cards</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">{playerStats.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center px-1 py-1">
                      <p className="w-1/3 text-left">Red Cards</p>
                      <p className="w-1/3 text-center text-xs md:text-sm">{playerStats.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
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
                    <p className="w-1/3 text-left text-xs md:text-sm">Total Shots</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.total_shots ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots on Target</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.shots_on_target ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shot on Target %</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.shots_on_target_percent ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots per 90</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.shots_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots on Target per 90</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.shots_on_target_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goals per Shot</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.goals_per_shot ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goals per Shot on Target</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.goals_per_shot_on_target ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Avg. Shot Distance</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.average_shot_distance ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots from Free Kicks</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.shots_from_fks ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Penalties Scored</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.pk_scored ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Penalties Taken</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.pk_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">xG</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.xg ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">npxG</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.npxg ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">npxG per Shot</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.npxg_per_shot ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goals</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">non-Penalty Goals</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.non_pk_goals ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goals - xG Difference</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">npGoals - npxG Difference</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.shooting?.[0]?.np_goals_npxg_diff ?? "N/A"}</p>
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
                    <p className="w-1/3 text-left text-xs md:text-sm">Shot Creating Actions</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.shot_creating_actions ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shot Creating Actions per 90</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.shot_creating_actions_per_90 ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goal Creating Actions</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.goal_creating_actions ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Goal Creating Actions per 90</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.gca_per_ninety || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Live Ball Pass SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.live_passes_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Live Ball Pass GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.live_passes_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Dead Ball Pass SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.dead_passes_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Dead Ball Pass GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.dead_passes_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Take-ons SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.take_ons_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Take-ons GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.take_ons_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.shots_sca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Shots GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.shots_gca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Fouls Drawn SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.fouls_drawn_sca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Fouls Drawn GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.fouls_drawn_gca || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Defensive SCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.def_sca ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Defensive GCA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.goal_and_shot_conversion?.[0]?.def_gca ?? "N/A"}</p>
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
                    <p className="w-1/3 text-left text-xs md:text-sm">Completed Passes</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.total_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Attempted Passes</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.total_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Pass Completion %</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.pass_completion_percentage ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Total Passing Distance</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.total_passing_distance ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Progressive Passing Distance</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.progressive_passing_distance || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Progressive Passes</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.progressive_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Short Passes Attempted</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.short_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Short Passes Completed</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.short_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Short Passes Completion %</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.short_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Medium Passes Attempted</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.medium_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Medium Passes Completed</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.medium_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Medium Passes Completion %</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.medium_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Long Passes Attempted</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.long_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Long Passes Completed</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.long_passes_completed ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Long Passes Completion %</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.long_pass_completion_percentage || "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Assists</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.assists ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">xA</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.xa ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">xAG</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.xag ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Assists - xAG Difference</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.assist_xag_diff ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Key Passes</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.key_passes ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Passes into Final Third</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.passes_into_final_third ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Passes into Penalty Area</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.passes_into_penalty_area ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-between items-center px-1 py-2">
                    <p className="w-1/3 text-left text-xs md:text-sm">Crosses into Penalty Area</p>
                    <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.passing?.[0]?.crosses_into_penalty_area ?? "N/A"}</p>
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
        <p className="w-1/3 text-left text-xs md:text-sm">Total Touches</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Live Ball Touches</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.live_ball_touches ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Passes Received</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.passes_received ?? "N/A"}</p>
      </div>

      {/* Touches by Area */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Touches in Defensive Third</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches_in_def_third ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Touches in Middle Third</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches_in_mid_third ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Touches in Attacking Third</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches_in_att_third ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Touches in Defensive Penalty Area</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches_in_def_pen_area ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Touches in Attacking Penalty Area</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.touches_in_att_pen_area ?? "N/A"}</p>
      </div>

      {/* Take-on Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Attempted Take-ons</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.attempted_take_ons ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Successful Take-ons</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.successful_take_ons ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Successful Take-ons %</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.successful_take_ons_percent ?? "N/A"}%</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Tackled During Take-on</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.tackled_during_take_on ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Tackled During Take-on %</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.tackled_during_take_on_percent ?? "N/A"}%</p>
      </div>

      {/* Carry Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Total Carries</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.carries ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Total Carrying Distance</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.total_carrying_distance ?? "N/A"}m</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Progressive Carries</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.progressive_carries ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Progressive Carrying Distance</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.progressive_carrying_distance ?? "N/A"}m</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Carries into Final Third</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.carries_into_final_third ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Carries into Penalty Area</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.carries_into_pen_area ?? "N/A"}</p>
      </div>

      {/* Progressive Passes */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Progressive Passes Received</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.progressive_passes_received ?? "N/A"}</p>
      </div>

      {/* Negative Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Miscontrols</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.miscontrols ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Times Dispossessed</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.possession?.[0]?.times_dispossessed ?? "N/A"}</p>
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
        <p className="w-1/3 text-left text-xs md:text-sm">Live Ball Passes</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.live_ball_passes ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Dead Ball Passes</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.dead_ball_passes ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Total Passes Completed</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.total_passes_completed ?? "N/A"}</p>
      </div>

      {/* Set Pieces */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Free Kick Passes</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.free_kick_passes ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Throw-ins Taken</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.throw_ins_taken ?? "N/A"}</p>
      </div>

      {/* Corner Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Corners Taken</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.corners_taken ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Inswinging Corners</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.inswinging_corners ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Outswinging Corners</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.outswinging_corners ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Straight Corners</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.straight_corners ?? "N/A"}</p>
      </div>

      {/* Attacking Passes */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Through Balls</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.through_balls ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Crosses</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.crosses ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Switches</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.switches ?? "N/A"}</p>
      </div>

      {/* Unsuccessful Passes */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Passes Offside</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.passes_offside ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Passes Blocked</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.pass_types?.[0]?.passes_blocked ?? "N/A"}</p>
      </div>
    </div>
  </Accordion.Body>
</Accordion.Item>

            <Accordion.Item eventKey="6">
  <Accordion.Header className="accordion-header">Defending</Accordion.Header>
  <Accordion.Body className="accordion-body">
    <div className="flex flex-col gap-4">
      {/* Tackle Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Total Tackles</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.tackles ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Tackles Won</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.tackles_won ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Tackles + Interceptions</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.tackles_and_interceptions ?? "N/A"}</p>
      </div>

      {/* Tackles by Area */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Defensive Third Tackles</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.defensive_third_tackles ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Middle Third Tackles</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.middle_third_tackles ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Attacking Third Tackles</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.attacking_third_tackles ?? "N/A"}</p>
      </div>

      {/* Dribbler Challenges */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Dribblers Challenged</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.dribblers_challenged ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Dribblers Tackled</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.dribblers_tackled ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Dribblers Tackled %</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.dribblers_tackled_percent ?? "N/A"}%</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Challenges Lost</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.challenges_lost ?? "N/A"}</p>
      </div>

      {/* Other Defensive Actions */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Interceptions</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.interceptions ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Total Blocks</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.blocks ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Shots Blocked</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.shots_blocked ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Passes Blocked</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.passes_blocked ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Clearances</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.clearances ?? "N/A"}</p>
      </div>

      {/* Errors */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Shot Leading Errors</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.defensive_actions?.[0]?.shot_leading_errors ?? "N/A"}</p>
      </div>
    </div>
  </Accordion.Body>
</Accordion.Item>

            <Accordion.Item eventKey="7">
  <Accordion.Header className="accordion-header">Playing Time</Accordion.Header>
  <Accordion.Body className="accordion-body">
    <div className="flex flex-col gap-4">
      {/* Basic Playing Time */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Matches Played</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.matches_played ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Minutes Played</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.minutes_played ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Minutes per Match</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.minutes_per_match ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">% Squad Minutes</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.percent_squad_mins ?? "N/A"}%</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">90s Played</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.nineties_played ?? "N/A"}</p>
      </div>

      {/* Starting Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Starts</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.starts ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Minutes per Start</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.minutes_per_start ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Complete Matches</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.complete_matches ?? "N/A"}</p>
      </div>

      {/* Substitute Statistics */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Sub Appearances</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.sub_appearances ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Minutes per Sub</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.minutes_per_sub ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Unused Sub Matches</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.unused_sub_matches ?? "N/A"}</p>
      </div>

      {/* Team Performance */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Points per Match</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.points_per_match ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team Goals For</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_goals_for ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team Goals Against</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_goals_against ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Goal Difference</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.goal_diff ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Goal Diff per 90</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.goal_diff_per_90 ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Net Goal Diff per 90</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.net_goal_diff_per_90 ?? "N/A"}</p>
      </div>

      {/* Expected Goals Team Performance */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team xG</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_xg ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team xGA</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_xga ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team xG Difference</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_xg_diff ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team xG Diff per 90</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_xg_diff_per_90 ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Team xG +/- Net Diff</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.playing_time?.[0]?.team_xg_plus_minus_net_diff ?? "N/A"}</p>
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
        <p className="w-1/3 text-left text-xs md:text-sm">Yellow Cards</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Red Cards</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Second Yellow Cards</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.second_yellow_cards ?? "N/A"}</p>
      </div>

      {/* Fouls */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Fouls Committed</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.fouls_commited ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Fouls Drawn</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.fouls_drawn ?? "N/A"}</p>
      </div>

      {/* Penalties */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Penalties Won</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.pk_won ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Penalties Conceded</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.pk_conceded ?? "N/A"}</p>
      </div>

      {/* Ball Recovery */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Ball Recoveries</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.ball_recoveries ?? "N/A"}</p>
      </div>

      {/* Aerial Duels */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Aerial Duels Won</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.aerial_duels_won ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Aerial Duels Lost</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.aerial_duels_lost ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Aerial Duels Won %</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.aerial_duels_won_percent ?? "N/A"}%</p>
      </div>

      {/* Other Infractions */}
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Offsides</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.offsides ?? "N/A"}</p>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <p className="w-1/3 text-left text-xs md:text-sm">Own Goals</p>
        <p className="w-1/3 text-center text-xs md:text-sm font-semibold">{playerStats.misc_stats?.[0]?.own_goals ?? "N/A"}</p>
      </div>
    </div>
  </Accordion.Body>
</Accordion.Item>

            {playerData?.positions?.split(",").includes("GK") && (
                <>
                  <Accordion.Item eventKey="9" alwaysOpen> {/* Goalkeeping */}             
                    <Accordion.Header className="accordion-header">Goalkeeping</Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div>
                        <div>
                        <p>Goals Against</p>
                        <p>{playerStats.goalkeeping?.[0]?.goals_against ?? "N/A"}</p>
                        </div>
                        
                        <div>
                        <p>Goals Against per 90</p>
                        <p>
                          {playerStats.goalkeeping?.[0]?.goals_against_per_90 ??
                            "N/A"}
                        </p>
                            </div>

                            <div>
                        <p>Shots on Target Against</p>
                        <p>
                          {playerStats.goalkeeping?.[0]?.shots_on_target_against ??
                            "N/A"}
                        </p>
</div>
<div>
                        <p>Saves</p>
                        <p>{playerStats.goalkeeping?.[0]?.saves ?? "N/A"}</p>
</div>
<div>
                        <p>Save %</p>
                        <p>{playerStats.goalkeeping?.[0]?.save_percent ?? "N/A"}</p>
</div>
<div>
                        <p>Clean Sheets</p>
                        <p>{playerStats.goalkeeping?.[0]?.clean_sheets ?? "N/A"}</p>
</div><div>
                        <p>Clean Sheet %</p>
                        <p>
                          {playerStats.goalkeeping?.[0]?.clean_sheet_percent ??
                            "N/A"}
                        </p>
</div>
<div>


                        <p>Penalty Kicks Faced</p>
                        <p>{playerStats.goalkeeping?.[0]?.pk_attempted ?? "N/A"}</p>
</div>

<div>


                        <p>Penalty Kicks Conceded</p>
                        <p>{playerStats.goalkeeping?.[0]?.pk_allowed ?? "N/A"}</p>
</div>
<div>
                        <p>Penalty Kicks Saved</p>
                        <p>{playerStats.goalkeeping?.[0]?.pk_saved ?? "N/A"}</p>
</div>
<div>
                        <p>Penalty Kicks Missed</p>
                        <p>{playerStats.goalkeeping?.[0]?.pk_missed ?? "N/A"}</p>
</div>
<div>
                        <p>Penalty Kick Save %</p>
                        <p>
                          {playerStats.goalkeeping?.[0]?.pk_save_percent ?? "N/A"}
                        </p>
</div>

<div>                 <p>Wins</p>
                        <p>{playerStats.goalkeeping?.[0]?.wins ?? "N/A"}</p>
</div>
       
<div>
                        <p>Draws</p>
                        <p>{playerStats.goalkeeping?.[0]?.draws ?? "N/A"}</p>
</div>
<div>
                        <p>Losses</p>
                        <p>{playerStats.goalkeeping?.[0]?.losses ?? "N/A"}</p>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="10" alwaysOpen> {/* Advanced Goalkeeping */}
                    <Accordion.Header className="accordion-header">Advanced Goalkeeping</Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div>
                        {/* Goals Against by Type */}
                        <div>
                          <p>Free Kick Goals Against</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.fk_goals_against ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Corner Goals Against</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.corner_goals_against ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Own Goals Against GK</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]?.ogs_against_gk ??
                              "N/A"}
                          </p>
                        </div>

                        {/* Post-Shot xG */}
                        <div>
                          <p>Post-Shot xG</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]?.post_shot_xg ??
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Post-Shot xG per Shot on Target</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.post_shot_xg_per_shot_on_target ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Post-Shot xG - Goals Allowed</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.post_shot_xg_goals_allowed_diff ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Post-Shot xG - Goals Allowed per 90</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.post_shot_xg_goals_allowed_p90_diff ?? "N/A"}
                          </p>
                        </div>

                        {/* Passing Statistics */}
                        <div>
                          <p>Launched Passes Completed</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.launched_passes_completed ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Launched Passes Attempted</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.launched_passes_attempted ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Pass Completion %</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.pass_completion_percent ?? "N/A"}
                            %
                          </p>
                        </div>
                        <div>
                          <p>Passes Attempted (Non-Goal Kick)</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.passes_attempted_non_goal_kick ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Throws Attempted</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.throws_attempted ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Non-Goal Kick Launch %</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.non_goal_kick_launch_percent ?? "N/A"}
                            %
                          </p>
                        </div>
                        <div>
                          <p>Non-Goal Kick Avg Pass Length</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.non_goal_kick_avg_pass_length ?? "N/A"}
                            m
                          </p>
                        </div>

                        {/* Goal Kicks */}
                        <div>
                          <p>Goal Kicks Attempted</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.goal_kicks_attempted ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Launched Goal Kick %</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.launched_goal_kick_percentage ?? "N/A"}
                            %
                          </p>
                        </div>
                        <div>
                          <p>Avg Goal Kick Length</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.avg_goal_kick_length ?? "N/A"}
                            m
                          </p>
                        </div>

                        {/* Cross Handling */}
                        <div>
                          <p>Crosses Faced</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]?.crosses_faced ??
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Crosses Stopped</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.crosses_stopped ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Crosses Stopped %</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.crosses_stopped_percent ?? "N/A"}
                            %
                          </p>
                        </div>

                        {/* Sweeper Keeper */}
                        <div>
                          <p>Defensive Actions Outside Penalty Area</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.defensive_actions_outside_pen_area ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Defensive Actions Outside Penalty Area per 90</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.defensive_actions_outside_pen_area_per_ninety ??
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>Avg Distance of Defensive Actions</p>
                          <p>
                            {playerStats.advanced_goalkeeping?.[0]
                              ?.avg_distance_of_defensive_actions ?? "N/A"}
                            m
                          </p>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </>
              )}
          </Accordion>
        </div>
        </div>
        </div>
        </div>
    );
  };
