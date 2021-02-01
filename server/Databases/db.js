const Pool = require('pg').Pool;

const pool = new Pool ({
    user: "postgres",
    password: "7982746691",
    host: "localhost",
    port: 5432,
    database: "eventhandle"
});

module.exports = pool;
