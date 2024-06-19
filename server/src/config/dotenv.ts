import dotenv from 'dotenv';

dotenv.config();

export default {
    DB_NAME: process.env.DB_NAME || 'recommendation_engine',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
};