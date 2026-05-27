import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { DBEnviroment } from './env';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = isProduction
  ? process.env.PROD_DB_URL
  : process.env.LOCAL_DB_URL;

if (!databaseUrl) {
  throw new Error(
    `Database URL is not defined in environment variables for ${
      isProduction ? 'production' : 'local'
    }`,
  );
}

const dbConfig = DBEnviroment[isProduction ? 'production' : 'development'];

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  models: [__dirname + '/models'],
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  ...Object.fromEntries(
    Object.entries(dbConfig).filter(
      ([key]) => !['database', 'username', 'password', 'host'].includes(key),
    ),
  ),
});

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Database connected successfully in ${
        isProduction ? 'production' : 'development'
      } mode!`,
    );
  } catch (error) {
    console.error('Error connecting to DB:', error);
  }
};
