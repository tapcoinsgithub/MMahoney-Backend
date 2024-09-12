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
    try{
        const result =  await pool.query(`
            INSERT INTO users (username, password)
            VALUES (?, ?)   
        `, [username, password])
        return result
    }
    catch(error){
        console.log(`Error is here: ${error}`)
        return false;
    }
}

async function login(username, password) {
    try{
        const result =  await pool.query(`
            SELECT * FROM users WHERE username = ? AND password = ?
        `, [username, password])
        if (result[0].length < 1 || result[0].length > 1){
            return false
        }
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