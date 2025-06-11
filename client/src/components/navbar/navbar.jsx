import {React, useState} from "react";
import './navbar.css';
import axios from "axios"


export const SearchResults = async (input) => {

    let searchResults = await axios.post('localhost:8855/search', {
        searchInput : input
    })

}

export const Navbar = () => {

    const [inputValue, setInputValue] = useState('');

    return (
        <div className="navbar">
            <div className="left">
                <a id="websiteLogo" href="">
                    <img src="images/logo.png" alt="Premier Metrics Logo" />
                    <span className="brand-name">Premier Metrics</span>
                </a>
            </div>

            
            <div className="middle">
                <input className="search-bar" type="text" value={inputValue}  placeholder="Look up..." onChange={(e) => setInputValue(e.target.value)}/>

                {inputValue != "" && (
                    <p>You typed {inputValue}</p>
                )}

            </div>

            <div className="right">
                <a href="#">Compare</a>
                <a href="#">Teams</a>
                <a href="#">Rank</a>
            </div>
        </div>
    );
};
