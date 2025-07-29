import { React, useState, useEffect } from "react";
import "./footer.css";

export const Footer = () => {
    return (
        <div id="footer-container">
        <div>
            <a href="https://youtu.be/UdDM4yTRejo?si=AEU_hbl_nRPIy9F6&t=4" target="_blank">
        <h4>Premier Metrics <img src="/images/logo.png"></img></h4>
        <p>by Pedro Boudoux</p>
        </a>
        </div>

        <div>
            <a href="https://www.linkedin.com/in/pedroboudoux/" target="_blank" >LinkedIn</a>
            <a href="https://github.com/pedro-boudoux/Premier-Metrics" target="_blank" >GitHub</a>
        </div>
        
    </div>
    );
}