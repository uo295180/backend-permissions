const express = require("express")
const routerPermissions = express.Router();

let permissions = require("../data/permissions")
let users = require("../data/users")
let authorizers = require("../data/authorizers")

routerPermissions.get("/", (req, res) => {
    res.json(permissions)
})

routerPermissions.put("/:id/approvedBy", (req, res) => {
    let permissionsId = req.params.id
    let autorizerEmail = req.body.autorizerEmail
    let authorizerPassword = req.body.authorizerPassword

    // validation
    let authorizer = authorizers.find(a => a.email == autorizerEmail && a.password == authorizerPassword)
    if(authorizer == undefined){
        return res.status(401).json({ error: "No autorizado" })
    }

    let permission = permissions.find(p => p.id == permissionsId)
    if(permission == undefined){
        return res.status(401).json({ error: "The specified permission does not exist" })
    }

    if(permission.approvedBy.find(ap => ap == authorizer.id) != undefined){
        return res.status(401).json({error : "This permission has already been authorized by this admin"})
    } 
    permission.approvedBy.push(authorizer.id)

    

    res.json(permission)
})

routerPermissions.post("/", (req,res) => {
    let text = req.body.text
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword

    let listUsers = users.filter( u => u.email == userEmail && u.password == userPassword)
    if(listUsers.length==0){
        return res.status(401).json({error: "no autorizado"})
    }

    let errors = []

    if(text == undefined){
        errors.push("no text in the body")
    }
    if(errors.length > 0){
        return res.status(400).json({ errors: errors})
    }


    let lastId = permissions[permissions.length-1].id

    permissions.push({
        id: lastId + 1, 
        text: text,
        approvedBy: [],
        userId: listUsers[0].id
    })

    res.json({id: lastId+1})
})

module.exports = routerPermissions