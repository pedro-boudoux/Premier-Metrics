import express from 'express';
import pg from 'pg';
import axios from 'axios';

const PORT = 3000
const server = express();

const db = new pg.Client({
    
})

server.get("/", (req, res) => {
    res.send("Server working");
})

server.listen(PORT, () => {
    console.log(`Server open on Port ${PORT}`);
})