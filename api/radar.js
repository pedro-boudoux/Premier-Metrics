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

            if (!playerStats) {
                // Player not found in one of the tables
                console.warn(`Stats not found for ${player.full_name}`);
                values = {
                    xg_p90: 0,
                    goals_p90: 0,
                    goals_xg_diff: 0,
                    interceptions_p90: 0,
                    tackles_won_p90: 0,
                    duels_won_p90: 0
                };
            } else {
                const safePlayed90s = played_90s > 0 ? played_90s : 1; // Avoid division by zero

                // If played_90s is 0, efficient p90 stats are 0 (or undefined), but let's handle it gracefully.
                // We use Number() to ensure we don't operate on strings.

                values = {
                    xg_p90: played_90s > 0 ? Number(playerStats.xg || 0) / played_90s : 0,
                    goals_p90: played_90s > 0 ? Number(playerStats.goals || 0) / played_90s : 0,
                    goals_xg_diff: Number(playerStats.goals || 0) - Number(playerStats.xg || 0),
                    interceptions_p90: played_90s > 0 ? Number(playerStats.interceptions || 0) / played_90s : 0,
                    tackles_won_p90: played_90s > 0 ? Number(playerStats.tackles_won || 0) / played_90s : 0,
                    duels_won_p90: played_90s > 0 ? Number(playerStats.duels_won || 0) / played_90s : 0
                }
            }

        } else {
            playerStats = await client.query(
                'SELECT * FROM keepers WHERE name ILIKE $1',
                player.full_name
            )
            playerStats = playerStats.rows[0];

            if (!playerStats) {
                console.warn(`Keeper stats not found for ${player.full_name}`);
                values = {
                    goals_prevented: 0,
                    clean_sheets: 0,
                    recoveries_p90: 0,
                    long_balls_accurate_p90: 0,
                    goals_conceded_p90: 0,
                    saves_p90: 0
                };
            } else {
                values = {
                    goals_prevented: playerStats.goals_prevented,
                    clean_sheets: playerStats.clean_sheet,
                    recoveries_p90: playerStats.recoveries / played_90s,
                    long_balls_accurate_p90: playerStats.long_balls_accurate / played_90s,
                    goals_conceded_p90: playerStats.goals_conceded / played_90s,
                    saves_p90: playerStats.saves / played_90s
                }
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

