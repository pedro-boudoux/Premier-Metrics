// api/top-performers.js
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let client;
    
    try {
        client = await getDbConnection();
        
        // Find current top assisting player
        const top_assister = await client.query(
            "SELECT passing.player_name, passing.assists, players.team FROM passing JOIN players ON passing.player_name = players.full_name WHERE passing.assists = (SELECT MAX(assists) FROM passing);"
        );

        const top_scorer = await client.query(
            "SELECT shooting.player_name, shooting.goals, players.team FROM shooting JOIN players ON shooting.player_name = players.full_name WHERE shooting.goals = (SELECT MAX(goals) FROM shooting);"
        );

        const top_clean_sheets = await client.query(
            "SELECT goalkeeping.player_name, goalkeeping.clean_sheets, players.team FROM goalkeeping JOIN players ON goalkeeping.player_name = players.full_name WHERE goalkeeping.clean_sheets = (SELECT MAX(clean_sheets) FROM goalkeeping);"
        );

        res.status(200).json({
            top_assister: top_assister.rows,
            top_scorer: top_scorer.rows,
            top_clean_sheets: top_clean_sheets.rows
        });

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) {
            await client.end();
        }
    }
}