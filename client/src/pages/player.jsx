import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Divider } from "../components/divider";
import { PlayerRadar } from "../components/player/radar";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import { STAT_SECTIONS } from "../data/stat_sections";

const StatRow = ({ label, value, unit = "" }) => (
  <div className="flex justify-between items-center px-1 py-2 border-b border-gray-100 last:border-0">
    <p className="w-1/3 text-left text-xs md:text-sm text-gray-600">{label}</p>
    <p className="w-1/3 text-right text-xs md:text-sm font-semibold text-premier-dark">
      {value ?? "N/A"}{value != null && value !== "N/A" ? unit : ""}
    </p>
  </div>
);

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

  const isGK = playerData?.positions?.split(",").some(p => p.trim() === "GK");


  useEffect(() => {
    if (location.state?.playerData) {
      setPlayerData(location.state.playerData);
    }
  }, [location.state]);


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.post("https://premier-metrics.vercel.app/api/team", {
          team: playerData.team,
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
          playerData: playerData
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
       if (playerData.full_name) {
         try {
           const x = await axios.post("https://premier-metrics.vercel.app/api/player-stats", {
             name: playerData.full_name,
           });

           console.log("THIS IS THE FETCHED PLAYER STATS:")
           console.log(x.data);

           setPlayerStats(x.data);
         } catch (err) {
           console.error(err);
         }
       }
     }

     fetchPlayerData();
   }, [playerData.full_name])

  return (


    <div className="flex flex-col w-full px-4 md:px-8 py-8 md:py-12">
      <title>{playerData.full_name + " 24/25 Premier League Stats"}</title>
      <div className="max-w-6xl mx-auto w-full">
        <div className="profile-card flex flex-col md:flex-row justify-between px-10 md:px-10 w-full h-auto md:min-h-[320px] items-center rounded-3xl shadow-premier gap-6 md:gap-0 8 md:mb-12">

          <div className="flex flex-col md:flex-col w-full md:w-auto">

            <h2 className="text-4xl md:text-6xl text-white m-0">{playerData.first_name}</h2>
            <h1 className="text-5xl md:text-7xl text-white mb-0 mt-0">{playerData.last_name}</h1>

          </div>

          <div className="flex flex-row md:flex-col gap-4 md:gap-2 items-center md:items-end w-full md:w-auto justify-between md:justify-start">

  <p className="text-base md:text-lg text-white m-0 leading-tight">
    {playerData.positions}
  </p>

  <div className="flex flex-row md:flex-col gap-2 items-center md:items-end">
    {/* using hidden md:block on the text is fine, but ensure the wrapper allows growth */}
    <p className="text-base md:text-lg text-white hidden md:block m-0">
      {playerData.team}
    </p>
    <img 
      src={"/images/compare/badges/" + playerData.team + "1.png"} 
      alt={playerData.team} 
      className="w-[35px] md:w-[50px] object-contain" 
    />
  </div>

  <p className="text-base md:text-lg text-white m-0 leading-tight">
    {playerData.nation}
  </p>          

</div>

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
              <PlayerRadar stats={positionStats.DF} position="DF"></PlayerRadar>
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
            <Accordion defaultActiveKey={["0"]} alwaysOpen>

              {/* Overview is special  */}
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

              {/* The Loop */}
              {Object.entries(STAT_SECTIONS).map(([sectionKey, config], index) => {
                // Skip GK sections for non-GKs
                if (!isGK && (sectionKey === "goalkeeping" || sectionKey === "advanced_goalkeeping")) return null;

                return (
                  <Accordion.Item eventKey={(index + 1).toString()} key={sectionKey}>
                    <Accordion.Header className="accordion-header">{config.title}</Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <div className="flex flex-col gap-4">
                        {config.fields.map((field) => (
                          <StatRow
                            key={field.key}
                            label={field.label}
                            // safe accessor: playerStats.shooting[0].total_shots
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
    </div>
  );
};
