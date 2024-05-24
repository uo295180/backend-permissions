const express = require("express")
const routerPermissions = express.Router();
let jwt = require("jsonwebtoken")


let permissions = require("../data/permissions")
let users = require("../data/users")

routerPermissions.get("/", (req, res) => {

    let text = req.query.text
    if ( text != undefined){
        return res.json(permissions.filter(p => p.text.includes(text)))
    }
    res.json(permissions)
})

routerPermissions.get("/:id", (req, res) => {

    let id = req.params.id
    if(id == undefined){
        return res.status(400).json({error: "no id"})
    }
    let permission = permissions.find( p => p.id == id)
    if(permission == undefined){
        return res.status(400).json({error: "no permission with this id"})
    }
    res.json(permission)
})

routerPermissions.delete("/:id", (req, res) =>{
    let permissionId = req.params.id
    if(permissionId == undefined){
        return res.status(400).json({ error: "no id"})
    }
    let permission = permissions.find(p => p.id == permissionId)

    if(permission == undefined){
        return res.status(400).json({ error: "no permission with this id"})
    }
    if(users.find(u => u.id == req.infoApiKey.id).role == "user" && permission.userId != req.infoApiKey.id ){
        return res.status(401).json({error: "This is not your permission and you're not admin"})
    }

    permissions = permissions.filter(p => p.id != permissionId)

    res.json({ deleted: true })
})

routerPermissions.put("/:id", (req, res) => {

    let permissionId = req.params.id
    let infoApiKey = req.infoApiKey

    if(permissionId == undefined){
        return res.status(400).json({ error: "no id"})
    }
    let permission = permissions.find(p => p.id == permissionId && p.userId == infoApiKey.id)

    if(permission == undefined){
        return res.status(400).json({ error: "no permission with this id"})
    }

    let text = req.body.text
    if(text != undefined){
        permission.text = text;
    }
    res.json({ modified: true})
})

routerPermissions.put("/:id/approvedBy", (req, res) => {
    let infoApiKey = req.infoApiKey

    let user = users.find(u => u.id == infoApiKey.id)
    if(user.role!="admin"){
        return res.status(401).json({error: "user is not admin"})
    }

    let permissionsId = req.params.id

    // validation
    let permission = permissions.find(p => p.id == permissionsId)
    if(permission == undefined){
        return res.status(400).json({ error: "The specified permission does not exist" })
    }

    if(permission.approvedBy.find(ap => ap == infoApiKey.id) != undefined){
        return res.status(401).json({error : "This permission has already been authorized by this admin"})
    } 
    permission.approvedBy.push(infoApiKey.id)

    

    res.json(permission)
})

routerPermissions.post("/", (req,res) => {
    let text = req.body.text
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
        userId: req.infoApiKey.id
    })

    res.json({id: lastId+1})
})

module.exports = routerPermissions