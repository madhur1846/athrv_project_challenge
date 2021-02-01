const router = require("express").Router();
const pools = require("../Databases/db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    const user = await pools.query(
      "SELECT * FROM users LEFT JOIN events ON users.user_id = events.user_id WHERE users.user_id = $1 AND can_show = true",
      [req.user]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/event", authorization, async (req, res) => {
  console.log(req);

  try {
    const newEvent = await pools.query(
      "INSERT INTO events (user_id, event_name, event_date, can_show) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user, req.body.event_name, req.body.event_date, true]
    );
    res.json(newEvent.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/event/:id", authorization, async (req, res) => {
  try {
    console.log(req.params.id);
    const removeEvent = await pools.query(
      "UPDATE events SET can_show = $1 WHERE event_id = $2 AND user_id = $3 RETURNING *",
      [false, req.params.id, req.user]
    );
    if (removeEvent.rows.length === 0)
      return res.json("This todo is not yours");
  } catch (error) {
    console.error(error);
  }
});

router.get("/:id", authorization, async (req, res) => {
  try {
    const user = await pools.query(
      "SELECT * FROM events LEFT JOIN audience ON events.event_id = audience.event_id WHERE events.event_id = $1",
      [req.params.id]
    );
    res.json(user.rows);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
