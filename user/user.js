import Express from 'express'
import User from './user.model.js'

const app = Express.Router()

app.get('/user/', async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.json(user) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.post('/user', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ status: 'success', user: newUser })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

export default app