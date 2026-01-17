import React, { useState, useEffect } from "react";
import axios from "axios";

// Use environment variable for API base, fallback to current deployment
const API_BASE = process.env.REACT_APP_API_BASE ||
  `${window.location.protocol}//${window.location.host}/api`;

export const LeagueTable = () => {
    const [table, setTable] = useState([]);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const response = await axios.get(`${API_BASE}/league-table`);
                setTable(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTable();
    }, []);

    return (
        <div className='flex flex-col w-full bg-gray-100 px-4 md:px-12 py-12 rounded-3xl shadow-premier text-lg'>
            <h3 className="text-xl md:text-2xl text-gray-700 mb-6 font-bold">Premier League Table</h3>
            <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-2 py-2 text-left">Pos.</th>
                        <th className="px-2 py-2 text-left">Team</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">MP</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">W</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">D</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">L</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">GF</th>
                        <th className="px-2 py-2 text-center hidden md:table-cell">GA</th>
                        <th className="px-2 py-2 text-center">Pts</th>
                        <th className="px-2 py-2 text-center">GD</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((team, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                            <td className="px-2 py-2 text-left">{team.rank}</td>
                            <td className="px-2 py-2 text-left font-medium">{(team.nickname || team.team) + (team.rank === 1 ? ' (C)' : '') + ([18,19,20].includes(team.rank) ? ' (R)' : '')}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.matches_played}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.wins}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.draws}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.losses}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.goals_for}</td>
                            <td className="px-2 py-2 text-center hidden md:table-cell">{team.goals_against}</td>
                            <td className="px-2 py-2 text-center">{team.pts}</td>
                            <td className="px-2 py-2 text-center font-medium">{team.goal_difference}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};
