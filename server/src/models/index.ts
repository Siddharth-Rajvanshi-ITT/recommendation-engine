import { ModelCtor, Sequelize } from 'sequelize-typescript';
import User from './user';
import dotenv from 'src/config/dotenv';

const env = 'development';
const dbConfig = dotenv;

const sequelize = new Sequelize({
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    dialect: 'mysql',
    models: [User] as any,
});

export default sequelize;
