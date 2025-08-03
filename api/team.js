// api/team.js
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let client;
    
    try {
        const team = req.body.team === "Wolverhampton Wanderers" ? "Wolves" : req.body.team;
        
        if (!team) {
            return res.status(400).json({ error: "Team name is required" });
        }

        client = await getDbConnection();
        
        const response = await client.query("SELECT * FROM teams WHERE team = $1", [team]);
        
        res.status(200).json(response.rows);
        
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) {
            await client.end();
        }
    }
}