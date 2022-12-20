const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

//load the content of .env file
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING);

//this function connects to the db and exports
async function start() {
    await client.connect();
    module.exports = client;

    //now that we're connceted to the db we start the express app
    const app = require("./app");
    app.listen(process.env.PORT);
}

start();
