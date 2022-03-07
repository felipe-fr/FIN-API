const express = require("express")

const app = express()

app.listen(3000)

app.get("/", (request,response) =>{
    response.send("Server is Working and It was started")
})