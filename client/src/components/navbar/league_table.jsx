import { React, useState, useEffect } from "react";
import axios from "axios";

export const LeagueTable = () => {

    const [table, setTable] = useState([]);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const response = await axios.post(...) // SET UP BACKEND AFTER WORK
                response = response.rows;

                setTable(response.rows);

            } catch (error) {
                console.error(error);
            }
        }
    })

return (
    <div id='league-table'>
        <h3>Premier League Table</h3>

        <table>

            <tr> 
                <th>Rank</th>
                <th>Team</th>
                <th>Pts</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts/MP</th>
                <th>xG</th>
                <th>xGA</th>
                <th>xGD</th>
                <th>xGD/90</th>
                <th>Attendance</th>
                <th>Top Scorer</th>
                <th>Goalkeeper</th>
            </tr>

        </table>

    </div>
)

}