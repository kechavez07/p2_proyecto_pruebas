import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: 'biokskqzeaoic27nghad-mysql.services.clever-cloud.com',
  username: 'u4djfg6dudvl6mmr',    // <-- username, no user
  password: 'WwCpfcsVcAEsYHuP47Mh',
  database: 'biokskqzeaoic27nghad',
  port: 3306,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
    process.exit(1);
  }
};

// Manejar eventos de conexión (cerrar con Ctrl+C)
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('📡 MySQL desconectado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cerrando conexión MySQL:', error);
    process.exit(1);
  }
});

export { sequelize };
