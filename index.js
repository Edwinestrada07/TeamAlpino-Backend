import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import UserRouter from './user/user.js'

dotenv.config()

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json()); // Para procesar JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }))

app.use(UserRouter)

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ruta para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('El servidor está funcionando')
})

// Puerto del servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Aplicación conectada en el puerto ${PORT}`)
})
