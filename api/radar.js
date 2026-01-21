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

        const isMidfielder = player.positions?.includes("M");
        const isForward = player.positions?.includes("F");
        const isGoalkeeper = player.positions?.includes("GK");
        const isDefender = player.positions?.includes("D");

        let values = {};

        let minutes_played = player.minutes || 0;
        let played_90s = minutes_played / 90;

        const offensiveResult = await client.query(
            "SELECT * FROM offensive WHERE name = $1",
            [player.full_name]
        );
        const defensiveResult = await client.query(
            "SELECT * FROM defensive WHERE name = $1",
            [player.full_name]
        );
        const keeperResult = await client.query(
            "SELECT * FROM keepers WHERE name = $1",
            [player.full_name]
        );

        const offensive = offensiveResult.rows[0];
        const defensive = defensiveResult.rows[0];
        const keeper = keeperResult.rows[0];

        const goals_per_90 = offensive?.goals ? offensive.goals / played_90s : 0;
        const xg_per_90 = offensive?.xg ? offensive.xg / played_90s : 0;
        const shots_per_90 = offensive?.shots ? offensive.shots / played_90s : 0;
        const goals_minus_xg = offensive?.xg ? (offensive.goals || 0) - offensive.xg : 0;
        const npxg = offensive?.np_xg || 0;

        const tackles_per_90 = defensive?.tackles_won ? defensive.tackles_won / played_90s : 0;
        const interceptions_per_90 = defensive?.interceptions ? defensive.interceptions / played_90s : 0;
        const duels_won_per_90 = defensive?.duels_won ? defensive.duels_won / played_90s : 0;

        if (isGoalkeeper && keeper) {
            const save_percent = keeper.save_percent;
            const goals_prevented = keeper.goals_prevented;
            const clean_sheet = keeper.clean_sheet;
            const clean_sheets_per_90 = clean_sheet ? clean_sheet / played_90s : 0;
            const saves_per_90 = keeper.saves ? keeper.saves / played_90s : 0;
            const goals_conceded_per_90 = keeper.goals_conceded ? keeper.goals_conceded / played_90s : 0;
            const pass_completion = keeper.touches > 0 ? (keeper.passes_accurate / keeper.touches) * 100 : 0;

            values.GK = {
                save_percent: save_percent || 0,
                goals_prevented: goals_prevented || 0,
                clean_sheets_per_90: clean_sheets_per_90 || 0,
                pass_completion: pass_completion || 0,
                saves_per_90: saves_per_90 || 0,
                goals_conceded_per_90: goals_conceded_per_90 || 0,
            };
        }

        if (isForward && offensive) {
            values.FW = {
                goals_per_90: goals_per_90 || 0,
                xg_per_90: xg_per_90 || 0,
                shots_per_90: shots_per_90 || 0,
                goals_minus_xg: goals_minus_xg || 0,
                npxg: npxg || 0,
                shot_accuracy: 0,
            };
        }

        if (isMidfielder && defensive) {
            values.MF = {
                goals_per_90: goals_per_90 || 0,
                xg_per_90: xg_per_90 || 0,
                shots_per_90: shots_per_90 || 0,
                key_passes_per_90: 0,
                tackles_per_90: tackles_per_90 || 0,
                interceptions_per_90: interceptions_per_90 || 0,
            };
        }

        if (isDefender && defensive) {
            values.DF = {
                tackles_per_90: tackles_per_90 || 0,
                interceptions_per_90: interceptions_per_90 || 0,
                duels_won_per_90: duels_won_per_90 || 0,
                def_actions_per_90: (tackles_per_90 + interceptions_per_90 + duels_won_per_90) || 0,
                recoveries: 0,
                clearances_per_90: 0,
            };
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

    let client;
    
    try {
        console.log(req.body);
        let player = req.body.playerData;
        console.log(player);

        if (!player || !player.full_name) {
            return res.status(400).json({ error: "Player data is required" });
        }

        client = await getDbConnection();

        const isMidfielder = player.positions?.includes("M");
        const isForward = player.positions?.includes("F");
        const isGoalkeeper = player.positions?.includes("GK");
        const isDefender = player.positions?.includes("D");

        let values = {};

        let minutes_played = player.minutes || 0;
        let played_90s = minutes_played / 90;

        if (isGoalkeeper) {
            const keeperResult = await client.query(
                "SELECT * FROM keepers WHERE name = $1",
                [player.full_name]
            );
            const keeper = keeperResult.rows[0];

            if (keeper) {
                const save_percent = keeper.save_percent;
                const goals_prevented = keeper.goals_prevented;
                const clean_sheet = keeper.clean_sheet;
                const clean_sheets_per_90 = clean_sheet ? clean_sheet / played_90s : 0;
                const saves_per_90 = keeper.saves ? keeper.saves / played_90s : 0;
                const goals_conceded_per_90 = keeper.goals_conceded ? keeper.goals_conceded / played_90s : 0;
                const pass_completion = keeper.touches > 0 ? (keeper.passes_accurate / keeper.touches) * 100 : 0;

                values.GK = {
                    save_percent: save_percent || 0,
                    goals_prevented: goals_prevented || 0,
                    clean_sheets_per_90: clean_sheets_per_90 || 0,
                    pass_completion: pass_completion || 0,
                    saves_per_90: saves_per_90 || 0,
                    goals_conceded_per_90: goals_conceded_per_90 || 0,
                };
            }
            console.log(values);
            res.status(200).json(values);
        } else {
            const offensiveResult = await client.query(
                "SELECT * FROM offensive WHERE name = $1",
                [player.full_name]
            );
            const defensiveResult = await client.query(
                "SELECT * FROM defensive WHERE name = $1",
                [player.full_name]
            );
            const offensive = offensiveResult.rows[0];
            const defensive = defensiveResult.rows[0];

            const goals_per_90 = offensive?.goals ? offensive.goals / played_90s : 0;
            const xg_per_90 = offensive?.xg ? offensive.xg / played_90s : 0;
            const shots_per_90 = offensive?.shots ? offensive.shots / played_90s : 0;
            const goals_minus_xg = offensive?.xg ? (offensive.goals || 0) - offensive.xg : 0;
            const npxg = offensive?.np_xg || 0;

            const tackles_per_90 = defensive?.tackles_won ? defensive.tackles_won / played_90s : 0;
            const interceptions_per_90 = defensive?.interceptions ? defensive.interceptions / played_90s : 0;
            const duels_won_per_90 = defensive?.duels_won ? defensive.duels_won / played_90s : 0;

            if (isForward) {
                values.FW = {
                    goals_per_90: goals_per_90 || 0,
                    xg_per_90: xg_per_90 || 0,
                    shots_per_90: shots_per_90 || 0,
                    goals_minus_xg: goals_minus_xg || 0,
                    npxg: npxg || 0,
                    shot_accuracy: 0,
                };
            }

            if (isMidfielder) {
                values.MF = {
                    goals_per_90: goals_per_90 || 0,
                    xg_per_90: xg_per_90 || 0,
                    shots_per_90: shots_per_90 || 0,
                    key_passes_per_90: 0,
                    tackles_per_90: tackles_per_90 || 0,
                    interceptions_per_90: interceptions_per_90 || 0,
                };
            }

            if (isDefender) {
                values.DF = {
                    tackles_per_90: tackles_per_90 || 0,
                    interceptions_per_90: interceptions_per_90 || 0,
                    duels_won_per_90: duels_won_per_90 || 0,
                    def_actions_per_90: (tackles_per_90 + interceptions_per_90 + duels_won_per_90) || 0,
                    recoveries: 0,
                    clearances_per_90: 0,
                };
            }

            res.status(200).json(values);
        }

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    } finally {
        if (client) {
            await client.end();
        }
    }
}