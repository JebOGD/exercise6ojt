// config/database.js
import { Sequelize } from 'sequelize';
import { readFileSync } from 'fs';

const env = process.env.NODE_ENV || 'development';
const configPath = new URL('./config.json', import.meta.url);
const config = JSON.parse(readFileSync(configPath, 'utf-8'))[env];

const dbConfig = config;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: console.log, 
});

sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); 
  });

export default sequelize;
