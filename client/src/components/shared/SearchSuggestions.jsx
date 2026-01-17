import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/**
 * SearchSuggestions - A unified search suggestions dropdown component
 * 
 * Props:
 * - input: The search query string
 * - onSelect: Callback when a suggestion is selected (optional, for compare mode)
 * - endpoint: API endpoint to use ('search' for navbar, 'player-search' for compare)
 * - mode: 'navigate' (default) or 'select' - determines behavior on click
 */
export const SearchSuggestions = ({ 
  input, 
  onSelect, 
  endpoint = "search", 
  mode = "navigate" 
}) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://premier-metrics.vercel.app/api/${endpoint}`,
          { search: input }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    if (input) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [input, endpoint]);

  if (mode === "navigate") {
    return (
      <div className="absolute top-full left-0 right-0 w-full bg-gray-200 text-gray-900 px-3 py-3 rounded-3xl z-50 flex flex-col mt-2 shadow-premier-lg text-sm md:text-base max-h-64 overflow-y-auto">
        {searchResults.length > 0 && searchResults.map((item, index) => (
          <Link 
            className="text-gray-700 px-4 py-2 hover:bg-gray-300 hover:rounded-3xl transition-colors no-underline rounded-3xl" 
            to={"/player/" + item.id} 
            state={{ playerData: item }} 
            key={index}
          >
            {item.full_name || item.team}
          </Link>
        ))}
        {!searchResults.length && (
          <p>No players/teams found!</p>
        )}
      </div>
    );
  }

  // Select mode - for compare page
  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-premier-lg z-10 flex flex-col mt-2 max-h-64 overflow-y-auto">
      {searchResults.map((player, index) => (
        <div 
          key={index} 
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b last:border-b-0"
          onClick={() => onSelect && onSelect(player)}
        >
          {player.full_name}
        </div>
      ))}
      {input && searchResults.length === 0 && (
        <div className="px-4 py-3 text-gray-500 text-center">No players found</div>
      )}
    </div>
  );
};
