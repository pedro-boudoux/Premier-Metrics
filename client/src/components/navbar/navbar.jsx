import React from "react"
import './navbar.css'

export const Navbar = () => {
    return (
        <div className="navbar">
            <div className="left">

                <a id="websiteLogo" href="">
                    <img src="images/logo.png" alt="Premier Metrics Logo" />
                    <span>Premier Metrics</span>
                </a>
                
            </div>

            <div className="middle">
                this is the middle part
            </div>

            <div className="right">
                this is the right part
            </div>
        </div>
    )
}