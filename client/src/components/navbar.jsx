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
        
        <a href={item.id} key={index}>{item.full_name || item.team}</a>
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

  return (
    <div className="navbar">
      <div className="left">
        <Link id="websiteLogo" to="/">
          <img src="images/logo.png" alt="Premier Metrics Logo" />
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
          />
          {inputValue != "" && <Suggestions input={inputValue}></Suggestions>}
        </div>
      </div>

      <div className="right">
        <Link to="/compare">Compare</Link>
        <Link to="/teams">Teams</Link>
      </div>
    </div>
  );
};
