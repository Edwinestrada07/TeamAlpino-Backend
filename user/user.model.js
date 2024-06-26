import { DataTypes, Model } from 'sequelize'
import sequelize from '../connect.js'

class User extends Model {} 

User.init (
    {
        name: {
            type: DataTypes.STRING,
        },
        cell_number: {
            type: DataTypes.STRING,
        },
        is_archer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rating: {
            type: DataTypes.INTEGER, 
            validate: {
                min: 1, // Mínimo valor de calificación
                max: 5, // Máximo valor de calificación
            },
        },
    }, {
        sequelize,
        modelName: 'User',
    }
)

User.sync({ alter:true })

export default User