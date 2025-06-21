import { React, useState, useEffect } from "react";
import axios from "axios";

export const TopPerformers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // backend calls to get the players here
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlayers();

  }, []);

  return (

  );

};
