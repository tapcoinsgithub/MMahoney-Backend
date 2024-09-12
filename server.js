const express = require('express');
const cors = require('cors');
const PORT = 8081
const database = require('./database')
const jwt = require('jsonwebtoken')
const app = express();
const dotenv = require('dotenv');
dotenv.config();

let refreshTokens = []

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // This is required for the `withCredentials` flag to work
};
app.use(cors(corsOptions));
app.use(express.json());

async function registerFunc(username, password){
    result = await database.register(username, password)
    return result;
}
async function LoginFunc(username, password) {
    result = await database.login(username, password)
    return result;
}
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    result = registerFunc(username, password);
    if (result){
        return res.send("From the Backend. Success");
    }
    else{
        return res.json("From the Backend. Failed");
    }
    
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    result = await LoginFunc(username, password);
    if (result){
        user = { username: username, password: password}
        accessToken = generatAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        console.log(refreshToken);
        refreshTokens.push(refreshToken)
        return res.send("Success");
    }
    else{
        return res.json("Failed");
    }
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generatAccessToken({ username: user.username } )
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function generatAccessToken(user) {
    return accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token,
        process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user
            next()
        }
    )
}

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`)
})