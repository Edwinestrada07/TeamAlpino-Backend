import express from 'express'
import User from './user.model.js'
import { Op } from 'sequelize'

const app = express.Router()

app.get('/user', async (req, res) => {
    try {
        const { name } = req.query // Extraemos el parámetro name de los parámetros de consulta de la solicitud
        const conditions = { status: 'ACTIVE' } // Define las condiciones con el estado activo

        if (name) {
            conditions.name = { [Op.iLike]: `%${name}%` }
        } // Busca por nombre si se proporciona mayus/minus

        const users = await User.findAll({ 
            where: conditions 
        }) // Utilizamos el método findAll del modelo User para obtener todos los usuarios que cumplan con las condiciones especificadas

        res.json(users) // Envía la respuesta en formato JSON

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params // Usamos req.params para obtener el nombre del parámetro de ruta

        const user = await User.findOne({
            where: {
                name: { [Op.iLike]: `%${id}%` } // Busca por nombre ignorando mayúsculas/minúsculas
            },
        }) //Obtenemos del usuario en la base de datos, utilizando método de sequelize

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        if (user.status === 'INACTIVE') {
            return res.status(200).json({ status: "INACTIVE", message: `Usuario ${id} está inactivo` })
        }

        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.post('/user', async (req, res) => {
    const { name, cell_number, is_archer, status } = req.body

    const totalCount = await User.count()
    if(totalCount >= 14) {
        return res.status(400).json({ error: 'Ya se ha excedido el número de jugadores.' })
    }

    if(is_archer) {
        const archerCount = await User.count({ where: { is_archer: true } })
        if(archerCount >= 2) {
            return res.status(400).json({ error: 'Ya hay dos arqueros registrados.' })
        }
    }

    try {
        const newUser = await User.create({ name, cell_number, is_archer, status })
        res.status(201).json({ status: 'Guardado con Éxito', user: newUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

app.put('/user/:id', async (req, res) => {
    const { id } = req.params
    const { name, cell_number, is_archer, status } = req.body

    const currentUser = await User.findByPk(id)

    if (is_archer && !currentUser.is_archer) {
        const archerCount = await User.count({ where: { is_archer: true } })
        if (archerCount >= 2) {
            return res.status(400).json({ error: 'Ya hay dos arqueros registrados.' })
        }
    }

    await User.update({ name, cell_number, is_archer, status }, {
        where: { id }
    })

    const updatedUser = await User.findByPk(id)
    res.json(updatedUser)
})

app.delete('/user/:id', async (req, res) => {
    await User.destroy({
        where: {
            id: req.params.id
        },
        individualHooks: true// Asegura que los ganchos de Sequelize se ejecuten correctamente
    })

    res.send({ status: "success"})
})

export default app
