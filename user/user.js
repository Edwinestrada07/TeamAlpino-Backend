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
});

app.post('/user', async (req, res) => {
    const { name, cell_number } = req.body
    try {
        const newUser = await User.create({ name, cell_number })
        res.status(201).json({ status: 'success', user: newUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [updated] = await User.update(req.body, { where: { id } })

        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const updatedUser = await User.findOne({ where: { id } })
        res.json({ status: 'success', user: updatedUser })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al actualizar el usuario' })
    }
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
