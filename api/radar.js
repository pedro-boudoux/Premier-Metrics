// api/radar

import db from '../lib/db.js';

export default async function handler(req, res) {

    if (req.method !== 'POST') res.status(405).send("Method Not Allowed");

console.log(req.body);
  let player = req.body.playerData;
  console.log(player);

  const isMidfielder = player.positions.includes("MF");
  const isForward = player.positions.includes("FW");
  const isGoalkeeper = player.positions.includes("GK");
  const isDefender = player.positions.includes("DF");

  let values = {};

  let minutes_played = await db.query(
    "SELECT minutes_played FROM playing_time WHERE player_name = $1",
    [player.full_name]
  );
  minutes_played = minutes_played.rows[0].minutes_played;
  let played_90s = minutes_played / 90;

  if (isGoalkeeper) {
    const save_percent = deRow(
      await db.query(
        "SELECT save_percent FROM goalkeeping WHERE player_name = $1",
        [player.full_name]
      )
    );

    const goals_prevented =
      deRow(
        await db.query(
          "SELECT post_shot_xg_goals_allowed_diff FROM advanced_goalkeeping WHERE player_name = $1",
          [player.full_name]
        )
      );

    const clean_sheets_per_90 =
      deRow(
        await db.query(
          "SELECT clean_sheets FROM goalkeeping WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;

    const crosses_stopped_percent =
      deRow(
        await db.query(
          "SELECT crosses_stopped_percent FROM advanced_goalkeeping WHERE player_name = $1",
          [player.full_name]
        )
      );

    const pass_completion_percent = deRow(
      await db.query(
        "SELECT pass_completion_percent FROM advanced_goalkeeping WHERE player_name = $1",
        [player.full_name]
      )
    );

    const touches_outside_box_per_90 =
      deRow(
        await db.query(
          "SELECT defensive_actions_outside_pen_area_per_ninety FROM advanced_goalkeeping WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;

    values.GK = {
      save_percent: save_percent,
      goals_prevented: goals_prevented,
      clean_sheets_per_90: clean_sheets_per_90,
      crosses_stopped_percent: crosses_stopped_percent,
      pass_completion_percent: pass_completion_percent,
      touches_outside_box_per_90: touches_outside_box_per_90,
    };
    console.log(values);
    res.status(200).send(values);
  } else {
    const tackles_and_int_per_90 =
      deRow(
        await db.query(
          "SELECT tackles_and_interceptions FROM defensive_actions WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;


    const clearances_per_90 = deRow(
      await db.query(
        "SELECT clearances FROM defensive_actions WHERE player_name = $1",
        [player.full_name]
      )
    ) / played_90s;

    const aerial_duels_won_percent =
      deRow(
        await db.query(
          "SELECT aerial_duels_won_percent FROM misc_stats WHERE player_name = $1",
          [player.full_name]
        )
      );

    let blocks = deRow(
      await db.query(
        "SELECT blocks FROM defensive_actions WHERE player_name = $1",
        [player.full_name]
      )
    );
    const blocks_per_90 = blocks / played_90s;

    const pass_completion_percentage =
      deRow(
        await db.query(
          "SELECT pass_completion_percentage FROM passing WHERE player_name = $1",
          [player.full_name]
        )
      );

    const progressive_passes_per_90 =
      deRow(
        await db.query(
          "SELECT progressive_passes FROM passing WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;

    const touches_in_att_third_per_90 =
      deRow(
        await db.query(
          "SELECT touches_in_att_third FROM possession WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;

    const goals_per_90 =
      deRow(
        await db.query("SELECT goals FROM shooting WHERE player_name = $1", [
          player.full_name,
        ])
      ) / played_90s;

    const xG = deRow(
      await db.query("SELECT xg FROM shooting WHERE player_name = $1", [
        player.full_name,
      ])
    );

    const shots_per_90 = deRow(
      await db.query(
        "SELECT shots_per_90 FROM shooting WHERE player_name =$1",
        [player.full_name]
      )
    );

    const shot_accuracy = deRow(
      await db.query(
        "SELECT shots_on_target_percent FROM shooting WHERE player_name = $1",
        [player.full_name]
      )
    );

    const gca_per_ninety = deRow(
      await db.query(
        "SELECT gca_per_ninety FROM goal_and_shot_conversion WHERE player_name = $1",
        [player.full_name]
      )
    );

    const key_passes_per_90 =
      deRow(
        await db.query(
          "SELECT key_passes FROM passing WHERE player_name = $1",
          [player.full_name]
        )
      ) / played_90s;

    if (isForward) {
      values.FW = {
        goals_per_90: goals_per_90,
        xG: xG,
        shots_per_90: shots_per_90,
        shot_accuracy: shot_accuracy,
        gca_per_ninety: gca_per_ninety,
        key_passes_per_90: key_passes_per_90,
      };
    }

    if (isDefender) {
      values.DF = {
        tackles_and_int_per_90: tackles_and_int_per_90,
        clearances_per_90: clearances_per_90,
        aerial_duels_won_percent: aerial_duels_won_percent,
        blocks_per_90: blocks_per_90,
        pass_completion_percentage: pass_completion_percentage,
        progressive_passes_per_90: progressive_passes_per_90,
      };
    }

    if (isMidfielder) {
      values.MF = {
        pass_completion_percentage: pass_completion_percentage,
        key_passes_per_90: key_passes_per_90,
        progressive_passes_per_90: progressive_passes_per_90,
        tackles_and_int_per_90: tackles_and_int_per_90,
        touches_in_att_third_per_90: touches_in_att_third_per_90,
        gca_per_ninety: gca_per_ninety,
      };
    }

    res.send(values);
  }

}