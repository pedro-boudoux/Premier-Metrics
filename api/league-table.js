// api/league-table
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    let client;
    
    try {
        client = await getDbConnection();
        const result = await client.query("SELECT * FROM league_table ORDER BY rank ASC;");
        const table = result.rows;
        
        res.status(200).json(table);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) {
            await client.end();
        }
    }
}