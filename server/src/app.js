import express from "express";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from '@supabase/supabase-js'

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const supabaseUrl = process.env.PROJECT_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey);



const PORT = 8080;


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, // better for security
  ssl: {
    rejectUnauthorized: false, // required for Supabase SSL
  },
});

db.connect();


function deRow(result) {
  // If there are no rows or no fields, return null to avoid errors
  if (!result.rows || result.rows.length === 0) return null;

  // Get the first row
  const firstRow = result.rows[0];

  // Return the value of the first field in that row
  const firstField = Object.keys(firstRow)[0];
  return firstRow[firstField];
}

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/search", async (req, res) => {
  // gets search input and cleans newlines
  let input = req.body.search;
  input = input.trim();
  let rawResult, result;
  console.log(`Searching for: ${input}`);

  try {
    // Player Search

    rawResult = await db.query(
      "SELECT * FROM players WHERE full_name ILIKE $1;",
      [`${input}%`]
    );
    console.log(rawResult);

    rawResult = rawResult.rows;

    result = [];

    for (let i = 0; i < 5; i++) {
      console.log(rawResult[i]);
      if (rawResult[i]) result.push(rawResult[i]);
    }
  } catch (err) {
    console.error(err);

    res.sendStatus(500);
  }

  // DISABLED TEAM SEARCH BECAUSE TEAM PAGE CANCELLED

  /*
  try {
    // Team Search

    rawResult = await db.query("SELECT * FROM teams WHERE team ILIKE $1;", [
      `${input}%`,
    ]);
    rawResult = rawResult.rows;

    for (let i = 0; i < 2; i++) {
      console.log(rawResult[i]);
      if (rawResult[i]) result.push(rawResult[i]);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } 
  */
  res.send(result);
});

app.get("/league-table", async (req, res) => {
  try {
    let table = await db.query("SELECT * FROM league_table ORDER BY rank ASC;");
    table = table.rows;

    res.send(table);
  } catch (error) {
    console.error(error);
    res.send(500);
  }
});

app.get("/top-performers", async (req, res) => {
  // FIND PLAYER(S) WITH MOST ASSISTS, SEND BACK: PLAYER NAME (and TEAM), ASSISTS, AND XA

  let topAssister, topScorer, topCleanSheets;

  try {
    topAssister = await db.query(
      "SELECT passing.player_name, passing.assists, players.team FROM passing JOIN players ON passing.player_name = players.full_name WHERE passing.assists = (SELECT MAX(assists) FROM passing);"
    );
    topAssister = topAssister.rows;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  // FIND PLAYER(S) WITH MOST GOALS, SEND BACK : PLAYER NAME (and TEAM), GOALS, XG

  try {
    topScorer = await db.query(
      "SELECT shooting.player_name, shooting.goals, players.team FROM shooting JOIN players ON shooting.player_name = players.full_name WHERE shooting.goals = (SELECT MAX(goals) FROM shooting);"
    );
    topScorer = topScorer.rows;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

  // FIND PLAYER(S) WITH MOST CLEAN SHEETS, SEND BACK: PLAYER NAME (and TEAM), and CLEAN SHEETS

  try {
    topCleanSheets = await db.query(
      "SELECT goalkeeping.player_name, goalkeeping.clean_sheets, players.team FROM goalkeeping JOIN players ON goalkeeping.player_name = players.full_name WHERE goalkeeping.clean_sheets = (SELECT MAX(clean_sheets) FROM goalkeeping);"
    );
    topCleanSheets = topCleanSheets.rows;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

  res.send({
    top_assister: topAssister,
    top_scorer: topScorer,
    top_keeper: topCleanSheets,
  });
});

app.post("/player-search", async (req, res) => {
  // gets search input and cleans newlines
  let input = req.body.search;
  input = input.trim();
  let rawResult, result;
  console.log(`Searching for: ${input}`);

  try {
    // Player Search

    rawResult = await db.query(
      "SELECT * FROM players WHERE full_name ILIKE $1;",
      [`${input}%`]
    );
    console.log(rawResult);

    rawResult = rawResult.rows;

    result = [];

    for (let i = 0; i < 5; i++) {
      console.log(rawResult[i]);
      if (rawResult[i]) result.push(rawResult[i]);
    }
  } catch (err) {
    console.error(err);

    res.sendStatus(500);
  }

  res.send(result);
});

app.post("/player-stats", async (req, res) => {
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

        //console.log(query);
        //console.log(`${table} : ${result.rows}`);

        playerStats[table] = result.rows;
      })
    );

    res.send(playerStats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not fetch player data.");
  }
});

app.post("/team", async (req, res) => {
  let team = req.body.team;
  console.log("POST : TEAM");

  if (team === "Wolves") team = "Wolverhampton Wanderers";

  try {
    const response = await db.query("SELECT * FROM teams WHERE team = $1", [
      team,
    ]);

    console.log(response.rows);
    res.send(response.rows);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

app.post("/radar", async (req, res) => {
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
    res.send(values);
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
});


/*
app.listen(PORT, () => {
  console.log(`Server open on Port ${PORT}`);
});
*/

export default app;