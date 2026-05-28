const dotenv = require('dotenv');
dotenv.config();

/**
 * Sequelize Configuration
 * Loads database config from environment variables without exposing credentials
 */

const migrationEnv = process.env.MIGRATION_ENV || 'local';

const baseConfig = {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

const config = {
  development: {
    ...baseConfig,
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT || 5432,
  },
  production: {
    ...baseConfig,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT || 5432,
  },
  local: {
    ...baseConfig,
    username: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT || 5432,
  },
};

module.exports = config;
