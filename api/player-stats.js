// api/player-stats.js
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let client;
    
    try {
        const player = req.body.name;
        
        if (!player) {
            return res.status(400).json({ error: "Player name is required" });
        }

        client = await getDbConnection();

        const tables = [
            "shooting",
            "possession",
            "playing_time",
            "passing",
            "pass_types",
            "misc_stats",
            "goalkeeping",
            "goal_and_shot_conversion",
            "defensive_actions",
            "advanced_goalkeeping",
        ];

        let playerStats = {};
        
        await Promise.all(
            tables.map(async (table) => {
                let query = `SELECT * FROM ${table} WHERE player_name ILIKE $1`;
                const result = await client.query(query, [`%${player}%`]);
                playerStats[table] = result.rows;
            })
        );

        res.status(200).json(playerStats);

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Could not fetch player data" });
    } finally {
        if (client) {
            await client.end();
        }
    }
}