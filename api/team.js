// api/team.js
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let client;
    
    try {
        const team = req.body.team === "Manchester Utd" ? "Manchester United" :
                     req.body.team === "Newcastle Utd" ? "Newcastle United" :
                     req.body.team === "Nott'ham Forest" ? "Nottingham Forest" :
                     req.body.team === "Wolves" ? "Wolverhampton Wanderers" :
                     req.body.team === "West Ham" ? "West Ham United" : 
                     req.body.team === "Tottenham" ? "Tottenham Hotspurs" :
                     req.body.team;
        
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