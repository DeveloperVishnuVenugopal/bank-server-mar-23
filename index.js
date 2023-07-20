// use packages
// load .env file to process,env
require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./db/conection')
const router = require("./Routes/router")
const middleware = require("./middleware/authMiddleware")

// crate an express application
const bankServer = express()

// use cores
bankServer.use(cors())
// use json parsor in server
bankServer.use(express.json())
bankServer.use(middleware.appMiddleware)



// use router to your server
bankServer.use(router)

// set up port number to lister server
const port = 3000 || process.env.PORT

// run/listen server app
bankServer.listen(port, () => {
    console.log(`Bankserver started at port no: ${port} `);
})

// get request
bankServer.get("/", (req, res) => {
    res.status(200).send(`<h1>Bank Server Started... </h1>`)
})