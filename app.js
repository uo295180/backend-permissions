let express = require("express")
let jwt = require("jsonwebtoken")

let app = express();
let port = 8081;

app.use(express.json())
app.use(express.static("public"))
app.use(["/permissions"], (req,res,next) => {
    console.log("middleware execution")
    let apiKey = req.query.apiKey
    if(apiKey == undefined){
        return res.status(401).json({error: "apiKey required"})
    }
    let infoApiKey = null
    try{
        infoApiKey = jwt.verify(apiKey, "secret")
    } catch (error) {
        return res.status(401).json({ error: "invalid token"})
    }

    req.infoApiKey = infoApiKey
    next()
})


let routerPermissions = require("./routers/routerPermissions")
app.use("/permissions", routerPermissions)

let routerUsers = require("./routers/routerUsers")
app.use("/users", routerUsers)

let routerLogin = require("./routers/routerLogin")
app.use("/login", routerLogin)

app.listen(port, () => {
    console.log("Servidor activo en "+port)
})