import React from "react";
import './navbar.css';

export const Navbar = () => {
    return (
        <div className="navbar">
            <div className="left">
                <a id="websiteLogo" href="">
                    <img src="images/logo.png" alt="Premier Metrics Logo" />
                    <span className="brand-name">Premier Metrics</span>
                </a>
            </div>

            <div className="middle">
                <input className="search-bar" type="text" placeholder="Look up.." />
            </div>

            <div className="right">
                <a href="#">Compare</a>
                <a href="#">Teams</a>
                <a href="#">Rank</a>
            </div>
        </div>
    );
};
