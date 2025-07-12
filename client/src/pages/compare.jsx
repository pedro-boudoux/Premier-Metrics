import React from "react";
import Accordion from "react-bootstrap/Accordion"
import PlayerCard from "../components/compare/player_card"

export const Compare = () => {


    
    return (
        <>
        This is the player comparison page
        
        <div>
        <h1>Player Comparison</h1>    
        <p>Head-to-head player comparison.</p>
        </div>

        <div>
            <PlayerCard player_name={}></PlayerCard>
            <PlayerCard player_name={}></PlayerCard>
        </div>

        </>

    );

};