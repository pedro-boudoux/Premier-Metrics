import { React, useState, useEffect } from "react";
import {Link} from "react-router-dom";
import axios from "axios";


export const Suggestions = ({ input }) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const response = await axios.post("https://premier-metrics.vercel.app/api/search", {
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
    <div className="absolute top-full left-0 right-0 w-full bg-gray-200 text-gray-900 px-3 py-3 rounded-3xl z-50 flex flex-col mt-2 shadow-premier-lg text-sm md:text-base max-h-64 overflow-y-auto">

      {searchResults.length > 0 && searchResults.map((item, index) => (
          
          <Link className="text-gray-700 px-4 py-2 hover:bg-gray-300 hover:rounded-3xl transition-colors no-underline rounded-3xl" to={"/player/"+item.id} state={{ playerData: item }} key={index}>{item.full_name || item.team}
          <div className="flex justify-between">
            {/* TEMPORARILY OVERSIMPLYING THE SEARCH SUGGESTIONS UNTIL I CAN PROPERLY FIX THEM FOR MOBILE USERS */}
           {/* <div>
              {item.positions}
            </div>
            <div>
              {item.team} | {item.nation}
            </div> */}
          </div>
        </Link>
      ))}

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
    <div className="w-full bg-premier-dark text-white px-4 md:px-8 py-4 md:py-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
        <div className="flex items-center flex-shrink-0">
          <Link className="flex items-center text-white gap-3 no-underline" to="/">
            <img src="/images/logo.png" alt="Premier Metrics Logo" className="w-10 h-auto" />
            <span className="font-bold text-base md:text-lg">Premier Metrics</span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center w-full md:w-auto">
          <div className="flex flex-col relative w-full md:w-96">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              <input
                className="w-full pl-9 pr-4 py-2 rounded-full border-none text-sm md:text-base text-gray-400 focus:outline-none focus:ring-2 focus:ring-premier-blue"
                type="text"
                value={inputValue}
                placeholder="Search players & teams..."
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  setTimeout(() => {
                    setIsSearchFocused(false);
                  }, 100);
                }}
              />
            </div>
            {inputValue !== "" && isSearchFocused && <Suggestions input={inputValue}></Suggestions>}
          </div>
        </div>

        <div className="flex gap-4 md:gap-6 flex-shrink-0">
          <Link className="text-white no-underline font-semibold text-sm md:text-base hover:text-gray-300 transition-colors" to="/compare">Compare</Link>
        </div>
      </div>
    </div>
  );
};
