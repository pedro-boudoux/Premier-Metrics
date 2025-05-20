import express from 'express';
import pg from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PG_HOST = process.env.PG_HOST
const PG_DATABASE = process.env.PG_DATABASE
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_PORT = process.env.PG_PORT
const PORT = process.env.BACKEND_PORT

const server = express();

server.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
    host : "localhost",
    database : "epl_tracker",
    user : "postgres",
    password : "pedro123",
    port : "5432"
})

db.connect()

server.get("/", (req, res) => {
    res.send("Server working");
})

server.post("/player-uuid", async (req, res) => {
    try {
        console.log(req.body);
        
        const uuid = req.body.player_uuid;
        const player = await db.query("SELECT * FROM players WHERE id = $1", [uuid]);
        
        if (player.rows.length > 0 && player.rows[0].positions) {
            const positionsArr = player.rows[0].positions.split(',').map(p => p.trim());
            // Remove duplicates if any
            player.rows[0].positions = [...new Set(positionsArr)];
        }

        console.log(player);
        res.json(player.rows);

    } catch (error) {

        console.error("Error fetching player:", error);
        res.status(500).json({ error: "Failed to fetch player data" });
        
    }
});

server.listen(PORT, () => {
    console.log(`Server open on Port ${PORT}`);
})