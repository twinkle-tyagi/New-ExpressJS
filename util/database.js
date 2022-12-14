/*
const mysql = require('mysql2');

// We close conenction after each query executes, if we create single connection, then we have to create a new connection each time we fire a query, which is very inefficient.
// so we will create pool of connections.
//pool manages multiple connection simulateously, so we can run multiple query simultaneously, when query is done, connection goes back to pool where it can be used for another query.
// pool finishes when application shuts down.

// create connection pool
const pool = mysql.createPool({
    host: 'localhost', // where our application is running, (server address)
    user: 'root', // username
    database: 'node-complete', 
    password: 'admin' //password we use during installation
}); 

module.exports = pool.promise(); // we use promise while exporting our pool, because promise handles async task and are more structured than callbacks.
*/

//using Sequelize
const Sequelize = require('sequelize');

// first three parameter is necessary, forth is optional.

const sequelize = new Sequelize('node-complete', 'root', 'admin', {
    dialect: 'mysql', 
    host: 'localhost'
});


// ---------------  GOING LIVE on AWS --------------

// when making project live we save our secrets = passwords and ID's, to .env file
// after saving to .env file, it have to modify code.

/*
const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});
*/

module.exports = sequelize;