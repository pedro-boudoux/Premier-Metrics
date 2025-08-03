// api/search.js
import { getDbConnection } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let client;
    
    try {
        let input = req.body.search?.trim();
        if (!input) {
            return res.status(400).json({ error: 'Missing search input' });
        }

        client = await getDbConnection();
        
        const { rows } = await client.query(
            "SELECT * FROM players WHERE full_name ILIKE $1 LIMIT 5;",
            [`${input}%`]
        );
        
        res.status(200).json(rows);
        
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.end();
        }
    }
}