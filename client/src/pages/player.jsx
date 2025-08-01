import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./player.css";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/radar";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";

function setBackgroundGradient(teamData) {
    const card = document.querySelector(".profile-card");
    const team = teamData[0];

    console.log("Team color: " + team.team_color);
    card.style.backgroundImage = `linear-gradient(to bottom, ${team.team_color}, ${team.team_color_darker})`;
}

export const Player = () => {
    const { id } = useParams();
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
                const response = await axios.post("http://localhost:8855/team", {
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
                const radar = await axios.post("http://localhost:8855/radar", {
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
                    const x = await axios.post("http://localhost:8855/player-stats", {
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
    }, [playerData])

    return (
      

        <div className="player">
            <title>{playerData.full_name + " 24/25 Premier League Stats"}</title>
        <div className="profile-card">
          
          <div>

            <h2>{playerData.first_name}</h2>
            <h1>{playerData.last_name}</h1>

          </div>

          <div>

            <p>{playerData.positions}</p>
            
            <p>  {playerData.team} <img src={"/images/compare/badges/" + playerData.team + "1.png"} alt={playerData.team} className="team-logo" /></p>
            
            <p>{playerData.nation}</p>

          </div>
            
        </div>

        <Divider></Divider>

        <div id="radar-container">

            {positionStats.GK && (
                // stuff for if the player is a goalkeeper
                <div>
                  <h3>Goalkeeper Stats</h3>
                <PlayerRadar stats={positionStats.GK} position="GK"></PlayerRadar>
              </div>
                
            )}

            {positionStats.DF && (
                // stuff for if the player is a defender
                <div>
                <h3>Defender Stats</h3>
                <PlayerRadar   stats={positionStats.DF} position="DF"></PlayerRadar>
              </div>
                
            )}

            {positionStats.MF && (
                // stuff for if the player is a midfielder
                <div>
                <h3>Midfielder Stats</h3>
                <PlayerRadar stats={positionStats.MF} position="MF"></PlayerRadar>
              </div>
                
            )}

            {positionStats.FW && (
                // stuff for if the player is a forward
                <div>
                 <h3>Forward Stats</h3>
                <PlayerRadar stats={positionStats.FW} position="FW"></PlayerRadar>
              </div>
            )}

        </div>

        <Divider></Divider>

        <div>
            <Accordion defaultActiveKey={["0", "9"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              {" "}
              {/* Overview */}
              <Accordion.Header className="accordion-header">Overview</Accordion.Header>
              <Accordion.Body className="accordion-body">
                {(playerStats) && (
                  <div>
                    <div>
                      <p>Matches Played</p>
                      <p>{playerStats.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                    </div>
                    <div>
                      <p>Goals</p>
                      <p>{playerStats.shooting?.[0]?.goals ?? "N/A"}</p>
                    </div>
                    <div>
                      <p>Assists</p>
                      <p>{playerStats.passing?.[0]?.assists ?? "N/A"}</p>
                    </div>

                    {playerData?.positions?.split(",").includes("GK") && (
                      <>
                        <div>

                          <p>Clean Sheets</p>
                          <p>
                            {playerStats.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                          </p>
                        </div>
                        <div>

                          <p>Saves</p>
                          <p>
                            {playerStats.goalkeeping?.[0]?.clean_sheets ?? "N/A"}
                          </p>
                        </div>
                      </>
                    )}

                    <div>
                      <p>Yellow Cards</p>
                      <p>{playerStats.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                    </div>
                    <div>
                      <p>Red Cards</p>
                      <p>{playerStats.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
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
                <div>
                  <div>
                    <p>Total Shots</p>
                    <p>{playerStats.shooting?.[0]?.total_shots ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Shots on Target</p>
                    <p>{playerStats.shooting?.[0]?.shots_on_target ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Shot on Target %</p>
                    <p>
                      {playerStats.shooting?.[0]?.shots_on_target_percent ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Shots per 90</p>
                    <p>{playerStats.shooting?.[0]?.shots_per_90 ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Shots on Target per 90</p>
                    <p>
                      {playerStats.shooting?.[0]?.shots_on_target_per_90 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Goals per Shot</p>
                    <p>{playerStats.shooting?.[0]?.goals_per_shot ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Goals per Shot on Target</p>
                    <p>
                      {playerStats.shooting?.[0]?.goals_per_shot_on_target ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Avg. Shot Distance</p>
                    <p>
                      {playerStats.shooting?.[0]?.average_shot_distance ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Shots from Free Kicks</p>
                    <p>{playerStats.shooting?.[0]?.shots_from_fks ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Penalties Scored</p>
                    <p>{playerStats.shooting?.[0]?.pk_scored ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Penalties Taken</p>
                    <p>{playerStats.shooting?.[0]?.pk_attempted ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>xG</p>
                    <p>{playerStats.shooting?.[0]?.xg ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>npxG</p>
                    <p>{playerStats.shooting?.[0]?.npxg ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>npxG per Shot</p>
                    <p>{playerStats.shooting?.[0]?.npxg_per_shot ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Goals</p>
                    <p>{playerStats.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>non-Penalty Goals</p>
                    <p>{playerStats.shooting?.[0]?.non_pk_goals ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Goals - xG Difference</p>
                    <p>{playerStats.shooting?.[0]?.goals_xg_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>npGoals - npxG Difference</p>
                    <p>{playerStats.shooting?.[0]?.np_goals_npxg_diff ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              {" "}
              {/*Goal and Shot Conversion*/}
              <Accordion.Header className="accordion-header">Goal and Shot Conversion</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  <div>
                    <p>Shot Creating Actions</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]
                        ?.shot_creating_actions ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Shot Creating Actions per 90</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]
                        ?.shot_creating_actions_per_90 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Goal Creating Actions</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]
                        ?.goal_creating_actions ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Goal Creating Actions per 90</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.gca_per_ninety ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Live Ball Pass SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.live_passes_sca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Live Ball Pass GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.live_passes_gca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Dead Ball Pass SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.dead_passes_sca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Dead Ball Pass GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.dead_passes_gca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Take-ons SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.take_ons_sca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Take-ons GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.take_ons_gca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Shots SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.shots_sca ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Shots GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.shots_gca ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Fouls Drawn SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.fouls_drawn_sca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Fouls Drawn GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.fouls_drawn_gca ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Defensive SCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.def_sca ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Defensive GCA</p>
                    <p>
                      {playerStats.goal_and_shot_conversion?.[0]?.def_gca ?? "N/A"}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              {" "}
              {/*Passing*/}
              <Accordion.Header className="accordion-header">Passing</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  <div>
                    <p>Completed Passes</p>
                    <p>
                      {playerStats.passing?.[0]?.total_passes_completed ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Attempted Passes</p>
                    <p>
                      {playerStats.passing?.[0]?.total_passes_attempted ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Pass Completion %</p>
                    <p>
                      {playerStats.passing?.[0]?.pass_completion_percentage ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Total Passing Distance</p>
                    <p>
                      {playerStats.passing?.[0]?.total_passing_distance ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Progressive Passing Distance</p>
                    <p>
                      {playerStats.passing?.[0]?.progressive_passing_distance ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Progressive Passes</p>
                    <p>{playerStats.passing?.[0]?.progressive_passes ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Short Passes Attempted</p>
                    <p>
                      {playerStats.passing?.[0]?.short_passes_attempted ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Short Passes Completed</p>
                    <p>
                      {playerStats.passing?.[0]?.short_passes_completed ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Short Passes Completion %</p>
                    <p>
                      {playerStats.passing?.[0]?.short_pass_completion_percentage ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p>Medium Passes Attempted</p>
                    <p>
                      {playerStats.passing?.[0]?.medium_passes_attempted ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Medium Passes Completed</p>
                    <p>
                      {playerStats.passing?.[0]?.medium_passes_completed ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Medium Passes Completion %</p>
                    <p>
                      {playerStats.passing?.[0]?.medium_pass_completion_percentage ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p>Long Passes Attempted</p>
                    <p>{playerStats.passing?.[0]?.long_passes_attempted ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Long Passes Completed</p>
                    <p>{playerStats.passing?.[0]?.long_passes_completed ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Long Passes Completion %</p>
                    <p>
                      {playerStats.passing?.[0]?.long_pass_completion_percentage ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p>Assists</p>
                    <p>{playerStats.passing?.[0]?.assists ?? "N/A"}</p>
                  </div>

                  <div>
                    <p>xA</p>
                    <p>{playerStats.passing?.[0]?.xa ?? "N/A"}</p>
                  </div>

                  <div>
                    <p>xAG</p>
                    <p>{playerStats.passing?.[0]?.xag ?? "N/A"}</p>
                  </div>

                  <div>
                    <p>Assists - xAG Difference</p>
                    <p>{playerStats.passing?.[0]?.assist_xag_diff ?? "N/A"}</p>
                  </div>

                  <div>
                    <p>Key Passes</p>
                    <p>{playerStats.passing?.[0]?.key_passes ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Passes into Final Third</p>
                    <p>
                      {playerStats.passing?.[0]?.passes_into_final_third ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Passes into Penalty Area</p>
                    <p>
                      {playerStats.passing?.[0]?.passes_into_penalty_area ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <p>Crosses into Penalty Area</p>
                    <p>
                      {playerStats.passing?.[0]?.crosses_into_penalty_area ?? "N/A"}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              {" "}
              {/*Possession*/}
              <Accordion.Header className="accordion-header">Possession</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  {/* Touch Statistics */}
                  <div>
                    <p>Total Touches</p>
                    <p>{playerStats.possession?.[0]?.touches ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Live Ball Touches</p>
                    <p>{playerStats.possession?.[0]?.live_ball_touches ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Passes Received</p>
                    <p>{playerStats.possession?.[0]?.passes_received ?? "N/A"}</p>
                  </div>

                  {/* Touches by Area */}
                  <div>
                    <p>Touches in Defensive Third</p>
                    <p>
                      {playerStats.possession?.[0]?.touches_in_def_third ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Touches in Middle Third</p>
                    <p>
                      {playerStats.possession?.[0]?.touches_in_mid_third ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Touches in Attacking Third</p>
                    <p>
                      {playerStats.possession?.[0]?.touches_in_att_third ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Touches in Defensive Penalty Area</p>
                    <p>
                      {playerStats.possession?.[0]?.touches_in_def_pen_area ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Touches in Attacking Penalty Area</p>
                    <p>
                      {playerStats.possession?.[0]?.touches_in_att_pen_area ?? "N/A"}
                    </p>
                  </div>

                  {/* Take-on Statistics */}
                  <div>
                    <p>Attempted Take-ons</p>
                    <p>{playerStats.possession?.[0]?.attempted_take_ons ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Successful Take-ons</p>
                    <p>
                      {playerStats.possession?.[0]?.successful_take_ons ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Successful Take-ons %</p>
                    <p>
                      {playerStats.possession?.[0]?.successful_take_ons_percent ||
                        "N/A"}
                      %
                    </p>
                  </div>
                  <div>
                    <p>Tackled During Take-on</p>
                    <p>
                      {playerStats.possession?.[0]?.tackled_during_take_on ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Tackled During Take-on %</p>
                    <p>
                      {playerStats.possession?.[0]?.tackled_during_take_on_percent ||
                        "N/A"}
                      %
                    </p>
                  </div>

                  {/* Carry Statistics */}
                  <div>
                    <p>Total Carries</p>
                    <p>{playerStats.possession?.[0]?.carries ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Total Carrying Distance</p>
                    <p>
                      {playerStats.possession?.[0]?.total_carrying_distance ?? "N/A"}
                      m
                    </p>
                  </div>
                  <div>
                    <p>Progressive Carries</p>
                    <p>
                      {playerStats.possession?.[0]?.progressive_carries ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Progressive Carrying Distance</p>
                    <p>
                      {playerStats.possession?.[0]?.progressive_carrying_distance ||
                        "N/A"}
                      m
                    </p>
                  </div>
                  <div>
                    <p>Carries into Final Third</p>
                    <p>
                      {playerStats.possession?.[0]?.carries_into_final_third ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Carries into Penalty Area</p>
                    <p>
                      {playerStats.possession?.[0]?.carries_into_pen_area ?? "N/A"}
                    </p>
                  </div>

                  {/* Progressive Passes */}
                  <div>
                    <p>Progressive Passes Received</p>
                    <p>
                      {playerStats.possession?.[0]?.progressive_passes_received ||
                        "N/A"}
                    </p>
                  </div>

                  {/* Negative Statistics */}
                  <div>
                    <p>Miscontrols</p>
                    <p>{playerStats.possession?.[0]?.miscontrols ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Times Dispossessed</p>
                    <p>{playerStats.possession?.[0]?.times_dispossessed ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              {" "}
              {/*Pass Types*/}
              <Accordion.Header className="accordion-header">Pass Types</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  {/* Basic Pass Types */}
                  <div>
                    <p>Live Ball Passes</p>
                    <p>{playerStats.pass_types?.[0]?.live_ball_passes ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Dead Ball Passes</p>
                    <p>{playerStats.pass_types?.[0]?.dead_ball_passes ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Total Passes Completed</p>
                    <p>
                      {playerStats.pass_types?.[0]?.total_passes_completed ?? "N/A"}
                    </p>
                  </div>

                  {/* Set Pieces */}
                  <div>
                    <p>Free Kick Passes</p>
                    <p>{playerStats.pass_types?.[0]?.free_kick_passes ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Throw-ins Taken</p>
                    <p>{playerStats.pass_types?.[0]?.throw_ins_taken ?? "N/A"}</p>
                  </div>

                  {/* Corner Statistics */}
                  <div>
                    <p>Corners Taken</p>
                    <p>{playerStats.pass_types?.[0]?.corners_taken ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Inswinging Corners</p>
                    <p>{playerStats.pass_types?.[0]?.inswinging_corners ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Outswinging Corners</p>
                    <p>
                      {playerStats.pass_types?.[0]?.outswinging_corners ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Straight Corners</p>
                    <p>{playerStats.pass_types?.[0]?.straight_corners ?? "N/A"}</p>
                  </div>

                  {/* Attacking Passes */}
                  <div>
                    <p>Through Balls</p>
                    <p>{playerStats.pass_types?.[0]?.through_balls ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Crosses</p>
                    <p>{playerStats.pass_types?.[0]?.crosses ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Switches</p>
                    <p>{playerStats.pass_types?.[0]?.switches ?? "N/A"}</p>
                  </div>

                  {/* Unsuccessful Passes */}
                  <div>
                    <p>Passes Offside</p>
                    <p>{playerStats.pass_types?.[0]?.passes_offside ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Passes Blocked</p>
                    <p>{playerStats.pass_types?.[0]?.passes_blocked ?? "N/A"}</p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              {/*Defending*/}
              <Accordion.Header className="accordion-header">Defending</Accordion.Header>
            <Accordion.Body className="accordion-body">
                <div>
                  {/* Tackle Statistics */}
                  <div>
                    <p>Total Tackles</p>
                    <p>{playerStats.defensive_actions?.[0]?.tackles ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Tackles Won</p>
                    <p>{playerStats.defensive_actions?.[0]?.tackles_won ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Tackles + Interceptions</p>
                    <p>
                      {playerStats.defensive_actions?.[0]
                        ?.tackles_and_interceptions ?? "N/A"}
                    </p>
                  </div>

                  {/* Tackles by Area */}
                  <div>
                    <p>Defensive Third Tackles</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.defensive_third_tackles ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Middle Third Tackles</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.middle_third_tackles ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Attacking Third Tackles</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.attacking_third_tackles ??
                        "N/A"}
                    </p>
                  </div>

                  {/* Dribbler Challenges */}
                  <div>
                    <p>Dribblers Challenged</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.dribblers_challenged ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Dribblers Tackled</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.dribblers_tackled ??
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Dribblers Tackled %</p>
                    <p>
                      {playerStats.defensive_actions?.[0]
                        ?.dribblers_tackled_percent ?? "N/A"}
                      %
                    </p>
                  </div>
                  <div>
                    <p>Challenges Lost</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.challenges_lost ?? "N/A"}
                    </p>
                  </div>

                  {/* Other Defensive Actions */}
                  <div>
                    <p>Interceptions</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.interceptions ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Total Blocks</p>
                    <p>{playerStats.defensive_actions?.[0]?.blocks ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Shots Blocked</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.shots_blocked ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Passes Blocked</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.passses_blocked ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Clearances</p>
                    <p>{playerStats.defensive_actions?.[0]?.clearances ?? "N/A"}</p>
                  </div>

                  {/* Errors */}
                  <div>
                    <p>Shot Leading Errors</p>
                    <p>
                      {playerStats.defensive_actions?.[0]?.shot_leading_errors ??
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
                    <p>Matches Played</p>
                    <p>{playerStats.playing_time?.[0]?.matches_played ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Minutes Played</p>
                    <p>{playerStats.playing_time?.[0]?.minutes_played ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Minutes per Match</p>
                    <p>
                      {playerStats.playing_time?.[0]?.minutes_per_match ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>% Squad Minutes</p>
                    <p>
                      {playerStats.playing_time?.[0]?.percent_squad_mins ?? "N/A"}%
                    </p>
                  </div>
                  <div>
                    <p>90s Played</p>
                    <p>{playerStats.playing_time?.[0]?.nineties_played ?? "N/A"}</p>
                  </div>

                  {/* Starting Statistics */}
                  <div>
                    <p>Starts</p>
                    <p>{playerStats.playing_time?.[0]?.starts ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Minutes per Start</p>
                    <p>
                      {playerStats.playing_time?.[0]?.minutes_per_start ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Complete Matches</p>
                    <p>{playerStats.playing_time?.[0]?.complete_matches ?? "N/A"}</p>
                  </div>

                  {/* Substitute Statistics */}
                  <div>
                    <p>Sub Appearances</p>
                    <p>{playerStats.playing_time?.[0]?.sub_appearances ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Minutes per Sub</p>
                    <p>{playerStats.playing_time?.[0]?.minutes_per_sub ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Unused Sub Matches</p>
                    <p>
                      {playerStats.playing_time?.[0]?.unused_sub_matches ?? "N/A"}
                    </p>
                  </div>

                  {/* Team Performance */}
                  <div>
                    <p>Points per Match</p>
                    <p>{playerStats.playing_time?.[0]?.points_per_match ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Team Goals For</p>
                    <p>{playerStats.playing_time?.[0]?.team_goals_for ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Team Goals Against</p>
                    <p>
                      {playerStats.playing_time?.[0]?.team_goals_against ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Goal Difference</p>
                    <p>{playerStats.playing_time?.[0]?.goal_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Goal Diff per 90</p>
                    <p>{playerStats.playing_time?.[0]?.goal_diff_per_90 ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Net Goal Diff per 90</p>
                    <p>
                      {playerStats.playing_time?.[0]?.net_goal_diff_per_90 ?? "N/A"}
                    </p>
                  </div>

                  {/* Expected Goals Team Performance */}
                  <div>
                    <p>Team xG</p>
                    <p>{playerStats.playing_time?.[0]?.team_xg ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Team xGA</p>
                    <p>{playerStats.playing_time?.[0]?.team_xga ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Team xG Difference</p>
                    <p>{playerStats.playing_time?.[0]?.team_xg_diff ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Team xG Diff per 90</p>
                    <p>
                      {playerStats.playing_time?.[0]?.team_xg_diff_per_90 ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>Team xG +/- Net Diff</p>
                    <p>
                      {playerStats.playing_time?.[0]?.team_xg_plus_minus_net_diff ??
                        "N/A"}
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              {" "}
              {/*Miscellaneous*/}
              <Accordion.Header className="accordion-header">Miscellaneous</Accordion.Header>
              <Accordion.Body className="accordion-body">
                <div>
                  {/* Disciplinary */}
                  <div>
                    <p>Yellow Cards</p>
                    <p>{playerStats.misc_stats?.[0]?.yellow_cards ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Red Cards</p>
                    <p>{playerStats.misc_stats?.[0]?.red_cards ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Second Yellow Cards</p>
                    <p>
                      {playerStats.misc_stats?.[0]?.second_yellow_cards ?? "N/A"}
                    </p>
                  </div>

                  {/* Fouls */}
                  <div>
                    <p>Fouls Committed</p>
                    <p>{playerStats.misc_stats?.[0]?.fouls_commited ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Fouls Drawn</p>
                    <p>{playerStats.misc_stats?.[0]?.fouls_drawn ?? "N/A"}</p>
                  </div>

                  {/* Penalties */}
                  <div>
                    <p>Penalties Won</p>
                    <p>{playerStats.misc_stats?.[0]?.pk_won ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Penalties Conceded</p>
                    <p>{playerStats.misc_stats?.[0]?.pk_conceded ?? "N/A"}</p>
                  </div>

                  {/* Ball Recovery */}
                  <div>
                    <p>Ball Recoveries</p>
                    <p>{playerStats.misc_stats?.[0]?.ball_recoveries ?? "N/A"}</p>
                  </div>

                  {/* Aerial Duels */}
                  <div>
                    <p>Aerial Duels Won</p>
                    <p>{playerStats.misc_stats?.[0]?.aerial_duels_won ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Aerial Duels Lost</p>
                    <p>{playerStats.misc_stats?.[0]?.aerial_duels_lost ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Aerial Duels Won %</p>
                    <p>
                      {playerStats.misc_stats?.[0]?.aerial_duels_won_percent ??
                        "N/A"}
                      %
                    </p>
                  </div>

                  {/* Other Infractions */}
                  <div>
                    <p>Offsides</p>
                    <p>{playerStats.misc_stats?.[0]?.offsides ?? "N/A"}</p>
                  </div>
                  <div>
                    <p>Own Goals</p>
                    <p>{playerStats.misc_stats?.[0]?.own_goals ?? "N/A"}</p>
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
)
}
