import { useState, useEffect } from "react";
import axios from "axios";

// Use environment variable for API base, fallback to current deployment
const API_BASE = process.env.REACT_APP_API_BASE ||
  `${window.location.protocol}//${window.location.host}/api`;

/**
 * usePlayerData - Custom hook to fetch all player-related data
 * 
 * Consolidates multiple API calls into a single hook:
 * - Team data (for colors)
 * - Radar stats (position-based stats for radar chart)
 * - Player stats (detailed stats for accordions)
 * 
 * @param {Object} playerData - The initial player data object
 * @returns {Object} { team, positionStats, playerStats, isLoading, error }
 */
export const usePlayerData = (playerData) => {
  const [team, setTeam] = useState({});
  const [positionStats, setPositionStats] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch team data
  useEffect(() => {
    const fetchTeam = async () => {
      if (!playerData?.team) return;
      
      try {
        const response = await axios.post(`${API_BASE}/team`, {
          team: playerData.team,
        });
        setTeam(response.data);
      } catch (err) {
        console.error("Error fetching team:", err);
        setError(err);
      }
    };

    fetchTeam();
  }, [playerData?.team]);

  // Fetch radar stats
  useEffect(() => {
    const fetchRadarStats = async () => {
      if (!playerData?.full_name) return;

      try {
        const response = await axios.post(`${API_BASE}/radar`, {
          playerData: playerData,
        });
        setPositionStats(response.data);
      } catch (err) {
        console.error("Error fetching radar stats:", err);
        setError(err);
      }
    };

    fetchRadarStats();
  }, [playerData?.full_name, playerData]);

  // Fetch detailed player stats
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!playerData?.full_name) return;

      setIsLoading(true);
      try {
        const response = await axios.post(`${API_BASE}/player-stats`, {
          name: playerData.full_name,
        });
        setPlayerStats(response.data);
      } catch (err) {
        console.error("Error fetching player stats:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerData?.full_name])

  return {
    team,
    positionStats,
    playerStats,
    isLoading,
    error,
  };
};

/**
 * useCompareData - Custom hook to fetch stats for two players being compared
 * 
 * @param {Object} player1 - First player data object
 * @param {Object} player2 - Second player data object
 * @returns {Object} { p1Data, p2Data, isLoading }
 */
export const useCompareData = (player1, player2) => {
  const [p1Data, setP1Data] = useState({});
  const [p2Data, setP2Data] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setIsLoading(true);
      
      try {
        const promises = [];
        
        if (player1?.full_name) {
          promises.push(
            axios.post(`${API_BASE}/player-stats`, { name: player1.full_name })
              .then(res => setP1Data(res.data))
              .catch(err => console.error("Player 1 error:", err))
          );
        }
        
        if (player2?.full_name) {
          promises.push(
            axios.post(`${API_BASE}/player-stats`, { name: player2.full_name })
              .then(res => setP2Data(res.data))
              .catch(err => console.error("Player 2 error:", err))
          );
        }
        
        await Promise.all(promises);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [player1?.full_name, player2?.full_name]);

  return { p1Data, p2Data, isLoading };
};
