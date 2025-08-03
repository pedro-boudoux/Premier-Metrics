// api/search
import db from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let input = req.body.search?.trim();
  if (!input) return res.status(400).send('Missing search input');

  try {
    const { rows } = await db.query(
      "SELECT * FROM players WHERE full_name ILIKE $1 LIMIT 5;",
      [`${input}%`]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}