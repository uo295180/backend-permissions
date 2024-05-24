const express = require("express")
let routerLogin = express.Router()
let users = require("../data/users")

routerLogin.post("/", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    users.find(u => u.email == email && u.password == password)
    if( user == undefined ){
        return res.status(401).json({ error: "invalid username or password"})
    }
})

module.exports = routerLogin