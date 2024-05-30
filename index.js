const express = require('express')
require('./connect')

const userRouter = require('./user/user')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken') 
const cors = require('cors') 

const app = express() 

//para realizar peticiones desde cualquier url (* significa todos) se puede restringir
app.use(cors({
  origin: '*'
}))

app.use(bodyParser.json()) //Parámetros a recibir son tipo Json
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRouter)

//Puerto del servidor
app.listen(3001, () => {
  console.log(`Example app listening on port ${3001}`)
})