// api/radar.js
import { getDbConnection } from '../lib/db.js';
import {deRow} from '../lib/helpers.js'

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

        const isMidfielder = player.positions.includes("MF");
        const isForward = player.positions.includes("FW");
        const isGoalkeeper = player.positions.includes("GK");
        const isDefender = player.positions.includes("DF");

        let values = {};

        let minutes_played = await client.query(
            "SELECT minutes FROM playing_time WHERE name = $1",
            [player.full_name]
        );
        minutes_played = deRow(minutes_played.rows[0]) || 0;
        let played_90s = minutes_played / 90;

        if (isGoalkeeper) {
            const save_percent = deRow(
                await client.query(
                    "SELECT save_percent FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );

            const goals_prevented = deRow(
                await client.query(
                    "SELECT goals_prevented FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );

            const clean_sheets = deRow(
                await client.query(
                    "SELECT clean_sheet FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );
            const clean_sheets_per_90 = clean_sheets ? clean_sheets / played_90s : 0;

            const saves = deRow(
                await client.query(
                    "SELECT saves FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );
            const saves_per_90 = saves ? saves / played_90s : 0;

            const goals_conceded = deRow(
                await client.query(
                    "SELECT goals_conceded FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );
            const goals_conceded_per_90 = goals_conceded ? goals_conceded / played_90s : 0;

            const passes_accurate = deRow(
                await client.query(
                    "SELECT accurate_passes FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );
            const touches = deRow(
                await client.query(
                    "SELECT touches FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );
            const pass_completion = touches > 0 ? (passes_accurate / touches) * 100 : 0;

            values.GK = {
                save_percent: save_percent || 0,
                goals_prevented: goals_prevented || 0,
                clean_sheets_per_90: clean_sheets_per_90 || 0,
                pass_completion: pass_completion || 0,
                saves_per_90: saves_per_90 || 0,
                goals_conceded_per_90: goals_conceded_per_90 || 0,
            };
            console.log(values);
            res.status(200).json(values);
        } else if (isForward || isMidfielder) {
            const goals = deRow(
                await client.query("SELECT goals FROM offensive WHERE name = $1", [
                    player.full_name,
                ])
            );
            const goals_per_90 = goals ? goals / played_90s : 0;

            const xG = deRow(
                await client.query("SELECT xg FROM offensive WHERE name = $1", [
                    player.full_name,
                ])
            );
            const xg_per_90 = xG ? xG / played_90s : 0;

            const shots = deRow(
                await client.query("SELECT shots FROM offensive WHERE name = $1", [
                    player.full_name,
                ])
            );
            const shots_per_90 = shots ? shots / played_90s : 0;

            const np_xg = deRow(
                await client.query("SELECT np_xg FROM offensive WHERE name = $1", [
                    player.full_name,
                ])
            );

            const goals_minus_xg = xG ? goals - xG : 0;

            const tackles_won = deRow(
                await client.query(
                    "SELECT tackles_won FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const tackles_per_90 = tackles_won ? tackles_won / played_90s : 0;

            const interceptions = deRow(
                await client.query(
                    "SELECT interceptions FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const interceptions_per_90 = interceptions ? interceptions / played_90s : 0;

            const key_passes = deRow(
                await client.query(
                    "SELECT key_passes FROM passing WHERE name = $1",
                    [player.full_name]
                )
            );
            const key_passes_per_90 = key_passes ? key_passes / played_90s : 0;

            if (isForward) {
                values.FW = {
                    goals_per_90: goals_per_90 || 0,
                    xg_per_90: xg_per_90 || 0,
                    shots_per_90: shots_per_90 || 0,
                    goals_minus_xg: goals_minus_xg || 0,
                    npxg: np_xg || 0,
                    shots_per_90: shots_per_90 || 0,
                };
            }

            if (isMidfielder) {
                values.MF = {
                    goals_per_90: goals_per_90 || 0,
                    xg_per_90: xg_per_90 || 0,
                    shots_per_90: shots_per_90 || 0,
                    key_passes_per_90: key_passes_per_90 || 0,
                    tackles_per_90: tackles_per_90 || 0,
                    interceptions_per_90: interceptions_per_90 || 0,
                };
            }

            res.status(200).json(values);
        } else if (isDefender) {
            const tackles_won = deRow(
                await client.query(
                    "SELECT tackles_won FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const tackles_per_90 = tackles_won ? tackles_won / played_90s : 0;

            const interceptions = deRow(
                await client.query(
                    "SELECT interceptions FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const interceptions_per_90 = interceptions ? interceptions / played_90s : 0;

            const duels_won = deRow(
                await client.query(
                    "SELECT duels_won FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const duels_won_per_90 = duels_won ? duels_won / played_90s : 0;

            const total_def_actions = deRow(
                await client.query(
                    "SELECT total_defensive_actions FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const def_actions_per_90 = total_def_actions ? total_def_actions / played_90s : 0;

            const recoveries = deRow(
                await client.query(
                    "SELECT recoveries FROM keepers WHERE name = $1",
                    [player.full_name]
                )
            );

            const clearances = deRow(
                await client.query(
                    "SELECT clearances FROM defensive WHERE name = $1",
                    [player.full_name]
                )
            );
            const clearances_per_90 = clearances ? clearances / played_90s : 0;

            values.DF = {
                tackles_per_90: tackles_per_90 || 0,
                interceptions_per_90: interceptions_per_90 || 0,
                duels_won_per_90: duels_won_per_90 || 0,
                def_actions_per_90: def_actions_per_90 || 0,
                recoveries: recoveries || 0,
                clearances_per_90: clearances_per_90 || 0,
            };

            res.status(200).json(values);
        } else {
            res.status(200).json({});
        }

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) {
            await client.end();
        }
    }
}