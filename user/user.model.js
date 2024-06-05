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
        }
    },
    {
        sequelize,
        modelName: 'User',
    }
)

User.sync({alter:true})

export default User