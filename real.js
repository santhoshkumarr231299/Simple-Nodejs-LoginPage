const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));

const clientPath = __dirname + '/public';

app.use(cors());

const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "newuser",
    password: "password1#",
    database: "userDB",
    port: "3306"
 })

app.use(function(req, res, next) {
    next();
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req,res) => {
    res.sendFile(clientPath + '/login.html');
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sqlSearch = "SELECT username, password FROM users where username = ? and password = ?";
    const searchQuery = mysql.format(sqlSearch, [username, password]);
    db.getConnection(async (err, connection) => {
        if(err) {
            res.sendStatus(500);
        } else {
            await connection.query(searchQuery, async (err, result) => {
                connection.release();
                if(err) {
                    res.sendStatus(500);
                } else {
                    if(result && result.length > 0) {
                        res.sendFile(clientPath + "home.html");
                    } else {
                        res.sendFile(clientPath + "login.html");
                    }
                }
            })
        }
    })
})

app.listen(PORT, function(err) {
    if (err) console.log("Error in starting the server");
    console.log(`Server has Started in http://localhost:${PORT}`);
});