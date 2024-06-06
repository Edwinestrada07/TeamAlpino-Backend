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
        status: {
            type: DataTypes.ENUM([ 'ACTIVE', 'INACTIVE', 'DELETE',  ]),
            defaultValue: 'ACTIVE'
        },
    }, {
        sequelize,
        modelName: 'User',
    }
)

User.sync({ alter:true })

export default User