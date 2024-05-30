const {Sequelize} = require('sequelize')

//driver://user:password@host:port/database
const sequelize = new Sequelize('postgres://postgres:12345@localhost:5432/TeamAlpino') //Conexión a la base de datos por medio de sequelize


sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a la base de datos con éxito.')
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error)
})

module.exports = sequelize