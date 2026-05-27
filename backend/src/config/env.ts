import fs from 'fs';
import path from 'path';
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

// convert to JSON string
// const json = JSON.stringify(DBEnviroment, null, 2);

// // output path (Sequelize expects config.json usually here)
// // const outputPath = path.join(__dirname, '../src/config/config.json');
// const outputPath = path.join(__dirname, './config.json');

// // write file
// fs.writeFileSync(outputPath, json, 'utf-8');

// console.log('✅ config.json generated successfully!');
