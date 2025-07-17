import express from "express";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config( {
  path: path.resolve(__dirname, '../.env') 
});

const PG_HOST = process.env.PG_HOST;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_PORT = process.env.PG_PORT;
const PORT = process.env.BACKEND_PORT;

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(express.json());

const db = new pg.Client({
  host: "localhost", // temp
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  port: PG_PORT,
});

db.connect();

server.get("/", (req, res) => {
  res.send("Server working");
});

server.post("/search", async (req, res) => {
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

  res.send(result);
});

server.get("/league-table", async (req, res) => {
  try {
    let table = await db.query("SELECT * FROM league_table ORDER BY rank ASC;");
    table = table.rows;

    res.send(table);
  } catch (error) {
    console.error(error);
    res.send(500);
  }
});

server.get("/top-performers", async (req, res) => {
  // FIND PLAYER(S) WITH MOST ASSISTS, SEND BACK: PLAYER NAME (and TEAM), ASSISTS, AND XA

  let topAssister, topScorer, topCleanSheets

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
    top_assister : topAssister,
    top_scorer : topScorer,
    top_keeper : topCleanSheets
  })

});

server.post("/player-search", async (req, res) => {
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

server.post("/player-stats", async (req, res) => {
  const player = req.body.name;

  let tables = ['shooting', 'possession', 'playing_time', 'passing', 'pass_types', 'misc_stats', 'goalkeeping', 'goal_and_shot_conversion', 'defensive_actions', 'advanced_goalkeeping']

  try {
    let playerStats = {}

    await Promise.all(
      tables.map(async (table) => {

        let query = `SELECT * FROM ${table} WHERE player_name ILIKE $1`;
        const result = await db.query(query, [`%${player}`])

        //console.log(query);
        //console.log(`${table} : ${result.rows}`);

        playerStats[table] = result.rows;

      })
    )

    res.send(playerStats);

  } catch (err) {
    console.error(err);
    res.status(500).send("Could not fetch player data.")
  }


})

server.listen(PORT, () => {
  console.log(`Server open on Port ${PORT}`);
});
