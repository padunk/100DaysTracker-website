const express = require("express");
const uuidv4 = require("uuid").v4;
const { Client } = require("pg");

const { handleError, handleSuccess } = require("../utilities/handleResponse");

const router = express.Router();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? true : false
});

client.connect(err => {
  if (err) {
    console.error(err.stack);
  } else {
    console.log("Connected to the database");
  }
});

router.get("/", (req, res, next) => {
  client.query("SELECT * FROM challenge", function(err, { rows }) {
    if (err) {
      handleError(res, err);
      return;
    }
    res.end(JSON.stringify(rows));
  });
});

// DETAIL CHALLENGE ROUTE
router.get("/detail/:challengeID", (req, res, next) => {
  const id = req.params.challengeID;
  const query = `
        SELECT * 
        FROM challenge_detail 
        WHERE parent_id='${id}'
        ORDER BY date_created DESC
    `;

  client.query(query, function(err, { rows }) {
    if (err) {
      handleError(res, err);
      return;
    }
    if (rows.length === 0) {
      res.end(JSON.stringify([null]));
    }
    res.end(JSON.stringify(rows));
  });
});

router.post("/detail/:challengeID", (req, res, next) => {
  const { progress: tweet } = req.body;
  const { challengeID: parent_id } = req.params;
  const data = [parent_id, tweet, new Date()];

  const insert = `INSERT INTO challenge_detail VALUES($1, $2, $3)`;
  client.query(insert, data, function(err) {
    if (err) {
      handleError(res, err);
      return;
    }
    handleSuccess(res, 205, "Success saving to database", parent_id);
    res.end();
  });
});

// NEW ROUND ROUTE
router.post("/add", (req, res, next) => {
  const id = uuidv4();
  let { title, hashtag, goal } = req.body;
  hashtag = hashtag.trim();
  hashtag[0] !== "#" && "#" + hashtag;
  const date = new Date();
  const data = [id, title.trim(), hashtag, goal.trim(), date];

  const insert = `INSERT INTO challenge VALUES($1, $2, $3, $4, $5)`;
  client.query(insert, data, function(err) {
    if (err) {
      handleError(res, err);
      return;
    }
    handleSuccess(res, 301, "Success saving to database", id);
    res.end();
  });
});

// SKILLS ROUTE
router.get("/skills", (req, res, next) => {
  client.query("SELECT * FROM skill_list", function(err, { rows }) {
    if (err) {
      handleError(res, err);
      return;
    }
    res.end(JSON.stringify(rows));
  });
});

router.post("/skills", (req, res, next) => {
  const id = uuidv4();
  const data = [id, req.body.newSkill.trim(), 1, 0, 0, new Date()];

  const insert = `INSERT INTO skill_list VALUES($1, $2, $3, $4, $5, $6)`;
  client.query(insert, data, function(err) {
    if (err) {
      handleError(res, err);
      return;
    }
    handleSuccess(res, 205, "Success saving data with id: ", "" + id);
    res.end();
  });
});

router.patch("/skills", (req, res, next) => {
  const { id, new_skill, progress_skill, complete_skill } = req.body;
  const data = [new_skill, progress_skill, complete_skill, id];

  const insert = `UPDATE skill_list 
    SET new_skill = $1, progress_skill = $2, complete_skill = $3
    WHERE skill_id = $4`;
  client.query(insert, data, function(err) {
    if (err) {
      handleError(res, err);
      return;
    }
    handleSuccess(res, 205, "Success updating data with id: ", id);
    res.end();
  });
});

router.delete("/skills", (req, res, next) => {
  const { id } = req.body;
  client.query(`DELETE FROM skill_list WHERE skill_id = $1`, [id], function(
    err
  ) {
    if (err) {
      handleError(res, err);
      return;
    }
    handleSuccess(res, 205, "Success deleting data with id: ", id);
    res.end();
  });
});

module.exports = router;
