const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function register(username, password) {
    console.log("IN REGISTER FUNCTION")
    try{
        const result =  await pool.query(`
            INSERT INTO users (username, password)
            VALUES (?, ?)   
        `, [username, password])
        console.log("REULT BELOW")
        console.log(result)
        return result
    }
    catch(error){
        console.log(`Error is here: ${error}`)
        return false;
    }
}

async function login(username, password) {
    console.log("IN LOGIN FUNCTION")
    try{
        const result =  await pool.query(`
            SELECT * FROM users WHERE username = ? AND password = ?
        `, [username, password])
        console.log("REULT BELOW")
        console.log(result[0])
        console.log(result[0].length)
        console.log(typeof result[0])
        if (result[0].length < 1 || result[0].length > 1){
            console.log("IN HERE RETURNING FALSE")
            return false
        }
        console.log("RETURNING TRUE")
        return result[0]
    }
    catch(error){
        console.log(`Error is here: ${error}`)
        return false;
    }
}

module.exports = {
    register,
    login
};