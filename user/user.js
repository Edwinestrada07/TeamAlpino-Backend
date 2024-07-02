import express from 'express'
import User from './user.model.js'
import { Op } from 'sequelize'

const app = express.Router()

app.get('/user', async (req, res) => {
    try {
        const { name } = req.query // Extraemos el parámetro name de los parámetros de consulta de la solicitud
        const conditions = { } // Define las condiciones con el estado activo

        if (name) {
            conditions.name = { [Op.iLike]: `%${name}%` }
        } // Busca por nombre si se proporciona mayus/minus

        const users = await User.findAll({ 
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: conditions 
        }) // Utilizamos el método findAll del modelo User para obtener todos los usuarios que cumplan con las condiciones especificadas

        res.json(users) // Envía la respuesta en formato JSON

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.get('/user/:name', async (req, res) => {
    try {
        const { name } = req.params // Usamos req.params para obtener el nombre del parámetro de ruta

        const user = await User.findOne({
            where: {
                name: { [Op.iLike]: `%${name}%` }, // Busca por nombre ignorando mayúsculas/minúsculas
            },
        }) //Obtenemos del usuario en la base de datos, utilizando método de sequelize

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
    const { name, cell_number, is_archer, rating, positions, goals, attendance } = req.body

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
        const newUser = await User.create({ name, cell_number, is_archer, rating, positions, goals, attendance })
        res.status(201).json({ status: 'Guardado con Éxito', user: newUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

app.put('/user/:id', async (req, res) => {
    const { id } = req.params
    const { name, cell_number, is_archer, rating, positions, goals, attendance } = req.body

    const currentUser = await User.findByPk(id)

    if (is_archer && !currentUser.is_archer) {
        const archerCount = await User.count({ where: { is_archer: true } })
        if (archerCount >= 2) {
            return res.status(400).json({ error: 'Ya hay dos arqueros registrados.' })
        }
    }

    await User.update({ name, cell_number, is_archer, rating, positions, goals, attendance }, {
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

    res.send({ status: "Éxito al eliminar jugador"})
})

// Ruta para actualizar la calificación de un jugador por su ID
app.put('/user/:id/rating', async (req, res) => {
    try {
        const { id } = req.params // Obtiene el ID del usuario de los parámetros de ruta
        const { rating } = req.body // Obtiene el nuevo rating del cuerpo de la solicitud

        // Busca y actualiza el usuario en la base de datos
        const updatedUser = await User.update(
            { rating },
            { 
                where: { id },
                returning: true, // Devuelve el usuario actualizado
                plain: true // Devuelve solo los datos actualizados
            }
        );

        if (!updatedUser[1]) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.json(updatedUser[1]) // Devuelve el usuario actualizado con el rating actualizado

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al actualizar el rating del usuario' })
    }
})

// Ruta para actualizar los goles de un jugador por su ID
app.put('/user/:id/goals', async (req, res) => {
    try {
        const { id } = req.params
        const { goals } = req.body

        const updatedUser = await User.update(
            { goals },
            {
                where: { id },
                returning: true,
                plain: true,
            }
        )

        if (!updatedUser[1]) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.json(updatedUser[1])
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al actualizar los goles del usuario' })
    }
})

// Ruta para actualizar las asistencias de un jugador por su ID
app.put('/user/:id/attendance', async (req, res) => {
    try {
        const { id } = req.params
        const { attendance } = req.body

        const updatedUser = await User.update(
            { attendance },
            {
                where: { id },
                returning: true,
                plain: true,
            }
        )

        if (!updatedUser[1]) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.json(updatedUser[1])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al actualizar la asistencia del usuario' })
    }
})


export default app
