const bcrypt = require('bcrypt');
const router = require("express").Router();
const pools = require('../Databases/db');
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require('../middleware/validation');
const authorization = require('../middleware/authorization');
// Route for Register
router.post("/register", validInfo, async (req, res) => {
    try {
        // destructuring the req.body
        const {name, email, password} = req.body;
        // console.log("working");
        // check if user exist
        const user = await pools.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if(user.rows.length !== 0) {
            return res.status(401).send("User already Exist");
        }
        // Bcrypt the user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert new user into the databases
        const newUser = await pools.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *", [name, email, bcryptPassword]
        );
        // res.json(newUser.rows[0]);

        //Generating our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);
        console.log(token);
        res.json({ token });

    } catch(err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Login Route
router.post("/login", validInfo, async (req, res) => {
    try {
        // Destructuring req body
        const {email, password} = req.body;
        // chheck if user doesn't exist 
        const user = await pools.query("SELECT * FROM users WHERE user_email = $1", [email]);
        // console.log(user);
        if(user.rows.length === 0) return res.status(401).json("Email or Password is incorrect");
        // check if incoming password is the correct
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if(!validPassword) return res.status(401).json("Wrong password");

        // Generating the token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token});

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
});

module.exports = router; 
