let express = require("express")

let app = express();
let port = 8081;

app.use(express.json())

let routerPermissions = require("./routers/routerPermissions")
app.use("/permissions", routerPermissions)

let routerUsers = require("./routers/routerUsers")
app.use("/users", routerUsers)

let routerLogin = require("./routers/routerLogin")
app.use("/login", routerLogin)

app.listen(port, () => {
    console.log("Servidor activo en "+port)
})