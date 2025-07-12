import mysql from 'mysql2/promise';

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'biokskqzeaoic27nghad-mysql.services.clever-cloud.com',
      user: 'u4djfg6dudvl6mmr',
      password: 'WwCpfcsVcAEsYHuP47Mh',
      database: 'biokskqzeaoic27nghad',
      port: 3306,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    });
    console.log('✅ Conexión exitosa a Clever Cloud');
    await connection.end();
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}
main();
