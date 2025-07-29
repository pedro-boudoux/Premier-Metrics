import { React, useState, useEffect } from "react";
import "./navbar.css";
import {Link} from "react-router-dom";
import axios from "axios";


export const Suggestions = ({ input }) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const response = await axios.post("http://localhost:8855/search", {
          search: input,
         });

        setSearchResults(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (input) fetchData();
  }, [input]);

  return (
    <div id="suggestions">

      {
      searchResults != [] && (searchResults.map((item, index) => (
          
          <Link className="player-link" to={"/player/"+item.id} state={{ playerData: item }} key={index}>{item.full_name || item.team}
          <div>
            <div>
              {item.positions}
            </div>
            <div>
              {item.team} | {item.nation}
            </div>
          </div>
        </Link>
      )))

      }

      {
        !searchResults[0] && (
            <p>No players/teams found!</p>
        )
      }
    </div>
  );
};

export const Navbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="navbar">
      <div className="left">
        <Link id="websiteLogo" to="/">
          <img src="/images/logo.png" alt="Premier Metrics Logo" />
          <span className="brand-name">Premier Metrics</span>
        </Link>
      </div>

      <div className="middle">
        <div id="searchContainer">
          <input
            className="search-bar"
            type="text"
            value={inputValue}
            placeholder="Look up..."
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={(e) => {
              // Small delay to allow clicking on suggestions
              setTimeout(() => {
                setIsSearchFocused(false);
              }, 100); // TIME THAT IT TAKES FOR THE SEARCH SUGGESTIONS TO DISAPPEAR
            }}
          />
          {inputValue != "" && isSearchFocused && <Suggestions input={inputValue}></Suggestions>}
        </div>
      </div>

      <div className="right">
        <Link to="/compare">Player Comparisons</Link>
      </div>
    </div>
  );
};
