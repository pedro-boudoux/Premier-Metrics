// api/team
import db from '../lib/db.js';

export default async function handler(req, res) {

    if (req.method !== 'POST') res.status(405).send("Method Not Allowed");

    const team = req.body.team === "Wolverhampton Wanderers" ? "Wolves" : req.body.team;

    try {
    const response = await db.query("SELECT * FROM teams WHERE team = $1", [
      team,
    ]);

    res.status(200).send(response.rows);
    
  } catch (err) {
    console.error(err);
    res.status(500);
  }

}
