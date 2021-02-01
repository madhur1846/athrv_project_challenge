const express = require('express');
const cors = require('cors');
const pools = require('./Databases/db');
const app = express();


//middleware
app.use(cors());
app.use(express.json());

// Register and login routes
app.use("/auth", require('./Routes/jwtAuth'));

app.use("/dashboard", require('./Routes/dashboard'));

app.get("/open-page", async (req, res) => {
    const AllEvents = await pools.query("SELECT * FROM events WHERE can_show = true");
    res.json(AllEvents);
});

app.post("/open-page/:id", async (req, res) => {
    try {
        const sendData = await pools.query("INSERT INTO audience (event_id, person_name, person_age, person_collage, person_number, person_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [req.params.id, req.body.person_name, req.body.person_age, req.body.person_collage, req.body.person_number, req.body.person_email]);
        res.json(sendData);    
    } catch (error) {
        res.status(500).json(error.message);
    }
});


app.listen(5000, () => {
    console.log("Server Running at Port 5000");
});