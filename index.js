import express from 'express';
import cors from 'cors'

import UserRouter from './user/user.js'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json()); // Para procesar JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));

app.use(UserRouter)

//Puerto del servidor
app.listen(3000, () => {
  console.log(`Aplicación conectada en el puerto ${3000}`)
})