// api/top-performers
import db from '../lib/db.js';

export default async function handler(req, res) {

    if (req.method !== 'GET') res.status(405).send("Method Not Allowed");

    let top_assister, top_scorer, top_clean_sheets;

    // Find current top assisting player
    try {
        top_assister = await db.query (
            "SELECT passing.player_name, passing.assists, players.team FROM passing JOIN players ON passing.player_name = players.full_name WHERE passing.assists = (SELECT MAX (assists) FROM passing);"
        );

        top_assister = top_assister.rows;

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }


    // Find current player with most goals
    try {
    top_scorer = await db.query(
      "SELECT shooting.player_name, shooting.goals, players.team FROM shooting JOIN players ON shooting.player_name = players.full_name WHERE shooting.goals = (SELECT MAX(goals) FROM shooting);"
    );
    top_scorer = top_scorer.rows;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

  // Find player with most clean sheets
  try {
    top_clean_sheets = await db.query(
      "SELECT goalkeeping.player_name, goalkeeping.clean_sheets, players.team FROM goalkeeping JOIN players ON goalkeeping.player_name = players.full_name WHERE goalkeeping.clean_sheets = (SELECT MAX(clean_sheets) FROM goalkeeping);"
    );
    top_clean_sheets = top_clean_sheets.rows;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

   res.status(200).send({
    top_assister: top_assister,
    top_scorer: top_scorer,
    top_keeper: top_clean_sheets,
  });

}