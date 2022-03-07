const express = require("express")
const {v4: uuidv4} = require("uuid")
const app = express()

// Definindo a porta que meu servidor vai rodar
app.listen(3000)

// Fazendo com que meu servidor possa receber json na request
app.use(express.json())

app.get("/", (request,response) =>{
    response.send("Server is Working and It was started")
})
/**
 * cpf -> string -> receber na criação da conta
 * name -> string -> receber na criação da conta
 * id -> uuid -> eu vou criar 
 * statement -> [] -> eu vou criar 
 */
const customers = []
app.post("/account", (request,response) =>{
    const { cpf, name } = request.body
    id = uuidv4()
    const customer = {
        name: name,
        cpf: cpf,
        id: id, 
        statement: []
    }
    customers.push(customer)
    return response.status(201).json(customer)

})