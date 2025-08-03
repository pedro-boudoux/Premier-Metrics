// api/player-stats
import db from '../lib/db.js';

export default async function handler(req, res) {

    if (req.method !== 'POST') res.status(405).send("Method Not Allowed");

     const player = req.body.name;

  let tables = [
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

  try {
    let playerStats = {};

    await Promise.all(
      tables.map(async (table) => {
        let query = `SELECT * FROM ${table} WHERE player_name ILIKE $1`;
        const result = await db.query(query, [`%${player}`]);
        playerStats[table] = result.rows;
      })
    );

    res.status(200).send(playerStats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not fetch player data.");
  }

}