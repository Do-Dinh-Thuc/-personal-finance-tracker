const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

//middlewares
app.use(express.json())
app.use(cors())

// Add debug middleware
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path}`);
    next();
});

//routes
readdirSync('./routes').map((route) => {
    console.log('📁 Loading route file:', route); // Debug
    return app.use('/api/v1', require('./routes/' + route))
})

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('🚀 Server listening on port:', PORT)
        console.log('🔑 JWT Secret exists:', !!process.env.JWT_SECRET)
        console.log('🔍 Google Client ID exists:', !!process.env.GOOGLE_CLIENT_ID)
    })
}

server()