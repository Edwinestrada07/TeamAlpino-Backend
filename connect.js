import Sequelize from 'sequelize'

// Usa la URL de conexión proporcionada por Supabase
const sequelize = new Sequelize('postgres://postgres.sykdchrxmrtzehhuooeb:12345@aws-0-us-west-1.pooler.supabase.com:6543/postgres');

// Conexión a la base de datos por medio de Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a la base de datos con éxito.')
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error)
  })

export default sequelize
