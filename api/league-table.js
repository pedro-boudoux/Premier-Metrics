// api/league-table
import db from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !=='GET') res.status(405).send("Method not allowed");

    try {
        let table = await db.query("SELECT * FROM league_table ORDER BY rank ASC;");
        table = table.rows;
    
        res.status(200).send(table);

    } catch (error) {
        console.error(error);
        res.send(500);
    }

}