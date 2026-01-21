// api/radar.js
import { getDbConnection } from '../lib/db.js';
import { deRow } from '../lib/helpers.js'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let client;

    try {
        console.log(req.body);
        let player = req.body.playerData;
        console.log(player);

        if (!player || !player.full_name) {
            return res.status(400).json({ error: "Player data is required" });
        }

        client = await getDbConnection();

        //const playerInfo = await client.query(
        //    'SELECT * FROM players WHERE full_name ILIKE $1',
        //    player.full_name
        //);

        let values = {}
        let playerStats = {}

        const isGoalkeeper = player.positions?.includes("GK");
        const played_90s = player.minutes / 90

        if (!isGoalkeeper) {

            playerStats = await client.query(
                'SELECT o.*, d.* FROM offensive o JOIN defensive d ON o.name ILIKE d.name WHERE o.name ILIKE $1;',
                player.full_name
            )
            playerStats = playerStats.rows[0];


            values = {
                xg_p90: playerStats.xg / played_90s,
                goals_p90: playerStats.goals / played_90s,
                goals_xg_diff: playerStats.goals - playerStats.xg,
                interceptions_p90: playerStats.interceptions / played_90s,
                tackles_won_p90: playerStats.tackles_won / played_90s,
                duels_won_p90: playerStats.duels_won / played_90s
            }

        } else {
            playerStats = await client.query(
                'SELECT * FROM keepers WHERE name ILIKE $1',
                player.full_name
            )

            values = {
                goals_prevented: playerStats.goals_prevented,
                clean_sheets: playerStats.clean_sheet,
                recoveries_p90: playerStats.recoveries / played_90s,
                long_balls_accurate_p90: playerStats.long_balls_accurate / played_90s,
                goals_conceded_p90: playerStats.goals_conceded / played_90s,
                saves_p90: playerStats.saves / played_90s

            }
        }

        console.log("Radar values:", values);
        res.status(200).json(values);

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    } finally {
        if (client) {
            await client.end();
        }
    }
}

