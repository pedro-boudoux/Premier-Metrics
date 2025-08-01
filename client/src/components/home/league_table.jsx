import { React, useState, useEffect } from "react";
import axios from "axios";
import "./league_table.css"

export const LeagueTable = () => {
    const [table, setTable] = useState([]);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const response = await axios.get("http://localhost:8855/league-table");
                setTable(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTable();
    }, []);

    return (
        <div id='league-table'>
            <h3>Premier League Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Pos.</th>
                        <th>Team</th>
                        <th>Pts</th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        {/*<th>Pts/MP</th>*/}
                        {/*<th>xG</th>*/}
                        {/*<th>xGA</th>*/}
                        {/*<th>xGD</th>*/}
                        {/*<th>xGD/90</th>*/}
                        {/*<th>Attendance</th>*/}
                        {/*<th>Top Scorer</th>*/}
                        {/*<th>Goalkeeper</th>*/}
                    </tr>
                </thead>
                <tbody>
                    {table.map((team, index) => (
                        <tr key={index}>
                            <td>{team.rank}</td>
                            <td>{(team.nickname || team.team) + (team.rank === 1 ? ' (C)' : '') + ([18,19,20].includes(team.rank) ? ' (R)' : '')}</td>
                            <td>{team.pts}</td>
                            <td>{team.matches_played}</td>
                            <td>{team.wins}</td>
                            <td>{team.draws}</td>
                            <td>{team.losses}</td>
                            <td>{team.goals_for}</td>
                            <td>{team.goals_against}</td>
                            <td>{team.goal_difference}</td>
                            {/*<td>{team.pts_per_match}</td>*/}
                            {/*<td>{team.xg}</td>*/}
                            {/*<td>{team.xga}</td>*/}
                            {/*<td>{team.xgd}</td>*/}
                            {/*<td>{team.xgd_per_90}</td>*/}
                            {/*<td>{team.attendance}</td>*/}
                            {/*<td>{team.top_scorer}</td>*/}
                            {/*<td>{team.goalkeeper}</td>*/}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
    );
};
