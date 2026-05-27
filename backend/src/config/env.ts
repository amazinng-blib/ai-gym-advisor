import dotenv from 'dotenv';
dotenv.config();

// export const env = {
//   nodeEnv: process.env.NODE_ENV ?? 'development',
//   databaseUrl: process.env.DATABASE_URL,
// };

export const DBEnviroment = {
  development: {
    username: process.env.DEV_DB_USERNAME as string,
    password: process.env.DEV_DB_PASSWORD as string,
    database: process.env.DEV_DB_USER as string,
    host: process.env.DEV_DB_HOST as string,
    dialect: 'postgres',
  },

  production: {
    username: process.env.PROD_DB_NAME as string,
    password: process.env.PROD_DB_PASSWORD as string,
    database: process.env.PROD_DB_USER as string,
    host: process.env.PROD_DB_HOST as string,
    dialect: 'postgres',
  },
};
