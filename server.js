const express = require('express');
const cors = require('cors');
const PORT = 8081
const database = require('./database')

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // This is required for the `withCredentials` flag to work
};
app.use(cors(corsOptions));
app.use(express.json());

async function registerFunc(username, password){
    console.log("IN REGISTER FUNC")
    result = await database.register(username, password)
    console.log("RESULR BELOW HERE");
    console.log(result);
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
    console.log("RESULT IS HERE");
    console.log(result);
    if (result){
        console.log("RESULT IS TRUE HERE")
        return res.send("Success");
    }
    else{
        console.log("RESULT IS FALSE HERE")
        return res.json("Failed");
    }
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`)
})