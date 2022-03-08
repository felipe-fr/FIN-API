const { request } = require("express")
const express = require("express")
const {v4: uuidv4} = require("uuid")
const app = express()

// Definindo a porta que meu servidor vai rodar
app.listen(3000)

// Fazendo com que meu servidor possa receber json na request
app.use(express.json())

//MIDDLEWARES
/**
 * MIDDLEWARES: uma Função que fica entre o request e o response
 */
// Criando o Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const {cpf} = request.headers
    const customer = customers.find( customer => customer.cpf === cpf)
    if (!customer) {
        return response.status(400).json({error: "That customer does not exist"})
    }
    // agora todas as rotas que implementarem esse middleware terão acesso a request.customer
    request.customer = customer
    return next()
}
// Usando o Middleware
// app.use(verifyIfExistsAccountCPF) -> se eu quiser que todas as rotas abaixo do app.use() usem esse middleware
//app.get("/statement/", verifyIfExistsAccountCPF, (request,response) quero que so essa rota use esse middleware


function getBalance(statement){

    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount
        }
        else{
            return acc - operation.amount
        }
    }, 0)
    return balance
}

//Root welcome message
app.get("/", (request,response) =>{
    response.send("Server is Working and It was started")
})

//Client data
/**
 * cpf -> string -> receber na criação da conta
 * name -> string -> receber na criação da conta
 * id -> uuid -> eu vou criar 
 * statement -> [] -> eu vou criar 
 */

var customers = []
app.post("/account", (request,response) =>{
    const { cpf, name } = request.body
    const customerAlreadyExists = customers.some((customer)=> customer.cpf === cpf)
    if (customerAlreadyExists){
        return response.status(400).json({error: "Customer Already Exists"})
    }

    const customer = {
        name: name,
        cpf: cpf,
        id: uuidv4(), 
        balance: getBalance([]),
        statement: []
    }
    customers.push(customer)
    console.log(customers)
    return response.status(201).json("criado com sucesso!")

})

app.get("/account", verifyIfExistsAccountCPF, (request,response) => {
    const {customer} = request
    return response.json(customer)
})

app.put("/account", verifyIfExistsAccountCPF, (request,response) => {
    const {customer} = request
    const {name} = request.body
    customer.name = name
    return response.status(201).json("Nome Atualizado com sucesso!!")
})

app.delete("/account", verifyIfExistsAccountCPF, (request,response) => {
    const {customer} = request
    customers = customers.filter((element) => element.cpf !== customer.cpf)
    return response.status(200).json(customers)
})
app.get("/statement", verifyIfExistsAccountCPF, (request,response) => {
    const {customer} = request
    return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) =>{
    const {description, amount} = request.body
    const {customer} = request

    const statementOperation = {
        description: description,
        amount: amount,
        created_at: new Date(),
        type: "credit"
    }
    customer.statement.push(statementOperation)
    customer.balance = getBalance(customer.statement)
    return response.status(201).json("deposito realizado com sucesso!")
})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) =>{
    const {description, amount} = request.body
    const {customer} = request

    const balance = getBalance(customer.statement)
    if(balance < amount){
        return response.status(400).json({error: "Saldo insuficiente!"})
    }
    const statementOperation = {
        description: description,
        amount: amount,
        created_at: new Date(),
        type: "Debit"
    }
    customer.statement.push(statementOperation)
    customer.balance = getBalance(customer.statement)
    return response.status(201).json("Retirada realizada com sucesso!")
})