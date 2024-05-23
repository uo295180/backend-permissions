const express = require("express")
const routerUsers = express.Router();

let users = require("../data/users")

routerUsers.get("/", (req, res) => {
    res.json(users.map( u => {return {id: u.id, email: u.email}}))
})
routerUsers.get("/:id", (req, res) => {
    let id = req.params.id
    if(id == undefined){
        return res.status(400).json({error: "no id"})
    }
    let user = users.find( u => u.id == id)
    if(user == undefined){
        return res.status(400).json({error: "no user with this id"})
    }
    res.json({ id: user.id, email: user.email})
})


module.exports = routerUsers