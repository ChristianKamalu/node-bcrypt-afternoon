const express = require('express');
require('dotenv').config();
const massive = require('massive');
const session = require('express-session');

const auth = require('./middleware/authMiddleware');
const treasureController = require('./controllers/treasureController');
const AuthCtrl = require('./controllers/Auth');

const app = express()

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is up and running')
})

app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 123456789
    }
}))

app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/logout', AuthCtrl.logout)
app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure)

app.listen(SERVER_PORT, console.log('listening on', SERVER_PORT));