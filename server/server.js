import express from "express";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PG_HOST = process.env.PG_HOST;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_PORT = process.env.PG_PORT;
const PORT = process.env.BACKEND_PORT;

const server = express();

server.use(express.urlencoded({ extended: true }));

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

  try { // Player Search
    
    rawResult = await db.query("SELECT * FROM players WHERE full_name ILIKE $1;", [`${input}%`])
    console.log(rawResult);

    rawResult = rawResult.rows;

    
    result = [];

    for (let i = 0; i < 5; i ++) {
      console.log(rawResult[i]);
      if (rawResult[i]) result.push(rawResult[i]);
    }

  } catch (err) {
    console.error(err);

    res.sendStatus(500);

  }

  try { // Team Search
  
    rawResult = await db.query("SELECT * FROM teams WHERE team ILIKE $1;", [`${input}%`])
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

server.listen(PORT, () => {
  console.log(`Server open on Port ${PORT}`);
});
