let express = require("express")

let app = express();
let port = 8081;

let routerPermissions = require("./routers/routerPermissions")

app.use("/permissions", routerPermissions)

app.listen(port, () =>{
    console.log("Servidor activo en " + port)
})