const mongoose = require("mongoose");
require('dotenv').config()

class Database {
    constructor() {
        this.connection = null;
    }

    connect() {
        console.log("Connecting to mongoDB...")

        mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("Connection established.");
        }).catch(err => {
            console.error(err)
        })
    }
}

module.exports = Database