import Express from 'express'
import User from './user.model.js'
import { Op } from 'sequelize'

const app = Express.Router()

app.get('/user', async (req, res) => {
    try {
        const { name } = req.query //Extraemos el parámetro name de los parámetros de consulta de la solicitud
        const conditions = { status: 'ACTIVE' } // Define las condiciones con el estado activo

        if (name) {
            conditions.name = { [Op.iLike]: `%${name}%` } // Busca por nombre si se proporciona
        }

        const users = await User.findAll({
            where: conditions, //Utilizamos el método findAll del modelo User para obtener todos los usuarios que cumplan con las condiciones especificadas.
        })

        res.json(users) // Envía la respuesta en formato JSON

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.get('/user/:name', async (req, res) => {
    try {
        const { name } = req.params // Usamos req.params para obtener el nombre del parámetro de ruta

        if (!name) {
            return res.status(400).json({ message: 'El nombre del usuario es requerido' })
        } //Verificamos que se haya proporcionado el parámetro name

        const user = await User.findOne({
            where: {
                name: { [Op.iLike]: `%${name}%` } // Busca por nombre ignorando mayúsculas/minúsculas
            },
        }) //Obtenemos del usuario en la base de datos, utilizando método de sequelize

        if (user.status === 'INACTIVE') {
            return res.status(200).json({ status: "INACTIVE", message: `Usuario ${name} esta inactivo` })
        }
        res.json(user)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

app.post('/user', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({ status: 'success', user: newUser })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

app.put('/user/:id', async (req, res) => {
    const user = await User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    res.send({status: "Success", user})
})

app.delete('/user/:name', async (req, res) => {
    try {
        const { name } = req.params; // Usamos req.params para obtener el nombre del parámetro de ruta

        if (!name) {
            return res.status(400).json({ message: 'El nombre del usuario es requerido' })
        } //Verificamos que se haya proporcionado el parámetro name

        const deleteCount = await User.destroy({
            where: {
                name: { [Op.iLike]: `%${name}%` } // Busca por nombre ignorando mayúsculas/minúsculas
            },
        }) //Eliminación del usuario en la base de datos, utilizando método de sequelize

        if (deleteCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.json({ status: 'success', message: `Usuario ${name} eliminado` })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al eliminar el usuario' })
    }
})

export default app