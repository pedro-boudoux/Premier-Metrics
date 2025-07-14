import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { PlayerCard } from "../components/compare/player_card";
import "bootstrap/dist/css/bootstrap.min.css";

export const Compare = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const handlePlayerSelect = (index, player) => {
    if (index === 0) {
      setPlayer1(player);
    } else {
      setPlayer2(player);
    }
  };

  return (
    <>
      <div>
        <h1>Player Comparison</h1>
        <p>Head-to-head player comparison.</p>
      </div>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <div>
          <h3>Player 1</h3>
          <PlayerCard
            onSelect={(player) => handlePlayerSelect(0, player)}
            selectedPlayer={player1}
          />
          {player1 && <p>Selected: {player1.full_name}</p>}
        </div>
        <div>
          <h3>Player 2</h3>
          <PlayerCard
            onSelect={(player) => handlePlayerSelect(1, player)}
            selectedPlayer={player2}
          />
          {player2 && <p>Selected: {player2.full_name}</p>}
        </div>
      </div>

      {/*  PLAYER STATS */}
      <div>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Overview</Accordion.Header>
            <Accordion.Body>
                
              {(!player1 || !player2) && <p>Select your players to compare!</p>}

              {((player1 && !player2) || (!player1 && player2)) && 
              <div>
                The selected player is {(player1 || player2).full_name}
                </div>
                }

                {(player1 && player2) && <div>
                    
                    There are two players selected {console.log(player1)}


                    </div>}


            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Accordion Item #2</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
};
