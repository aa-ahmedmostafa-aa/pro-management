import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: "./.env.local" });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  SERVICE_NAME: string | undefined;
  PORT: number | undefined;
  BASE_URL: string | undefined;
  DEFAULT_PAGE_SIZE: number | undefined;
  DEFAULT_PAGE_NUMBER: number | undefined;
  NODE_ENV: string | undefined;
  DB_TYPE: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_INSTANCE: string | undefined;
  SALT_ROUNDS: number | undefined;
  TOKEN_KEYS_PATH: string | undefined;
  TOKEN_PRIVATE_KEY_NAME: string | undefined;
  TOKEN_PUBLIC_KEY_NAME: string | undefined;
  TOKEN_EXPIRY_DURATION_IN_SECONDS: number | undefined;
  USERS_IMAGES_DIRECTORY_PATH: string | undefined;
  SMTP_HOST: string | undefined;
  SMTP_PORT: number | undefined;
  SMTP_USER_NAME: string | undefined;
  SMTP_PASSWORD: string | undefined;
  SMTP_SENDER: string | undefined;
  CONTACT_US_URL: string | undefined;
  COMPANY_NAME: string | undefined;
  PRODUCT_NAME: string | undefined;
  LOGGING_DIRECTORY: string | undefined;
  CONNECTION_STRING_DB: string | undefined;
  DEPLOYMENT_HOST: string | undefined;
  NEW_USERS_NEED_ADMIN_APPROVABLE: boolean | undefined;
}

interface Config {
  SERVICE_NAME: string;
  PORT: number;
  BASE_URL: string;
  DEFAULT_PAGE_SIZE: number;
  DEFAULT_PAGE_NUMBER: number;
  NODE_ENV: string;
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_INSTANCE: string;
  SALT_ROUNDS: number;
  TOKEN_KEYS_PATH: string;
  TOKEN_PRIVATE_KEY_NAME: string;
  TOKEN_PUBLIC_KEY_NAME: string;
  TOKEN_EXPIRY_DURATION_IN_SECONDS: number;
  USERS_IMAGES_DIRECTORY_PATH: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER_NAME: string;
  SMTP_PASSWORD: string;
  SMTP_SENDER: string;
  CONTACT_US_URL: string;
  COMPANY_NAME: string;
  PRODUCT_NAME: string;
  LOGGING_DIRECTORY: string;
  CONNECTION_STRING_DB: string;
  DEPLOYMENT_HOST: string;
  NEW_USERS_NEED_ADMIN_APPROVABLE: boolean;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    SERVICE_NAME: process.env.SERVICE_NAME,
    PORT: parseInt(process.env.PORT || ""),
    BASE_URL: process.env.BASE_URL,
    DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || ""),
    DEFAULT_PAGE_NUMBER: parseInt(process.env.DEFAULT_PAGE_NUMBER || ""),
    NODE_ENV: process.env.NODE_ENV,
    DB_TYPE: process.env.DB_TYPE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: parseInt(process.env.DB_PORT || ""),
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_INSTANCE: process.env.DB_INSTANCE,
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || ""),
    TOKEN_KEYS_PATH: process.env.TOKEN_KEYS_PATH,
    TOKEN_PRIVATE_KEY_NAME: process.env.TOKEN_PRIVATE_KEY_NAME,
    TOKEN_PUBLIC_KEY_NAME: process.env.TOKEN_PUBLIC_KEY_NAME,
    TOKEN_EXPIRY_DURATION_IN_SECONDS: parseInt(
      process.env.TOKEN_EXPIRY_DURATION_IN_SECONDS || ""
    ),
    USERS_IMAGES_DIRECTORY_PATH: process.env.USERS_IMAGES_DIRECTORY_PATH,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || ""),
    SMTP_USER_NAME: process.env.SMTP_USER_NAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_SENDER: process.env.SMTP_SENDER,
    CONTACT_US_URL: process.env.CONTACT_US_URL,
    COMPANY_NAME: process.env.COMPANY_NAME,
    PRODUCT_NAME: process.env.PRODUCT_NAME,
    LOGGING_DIRECTORY: process.env.LOGGING_DIRECTORY,
    DEPLOYMENT_HOST: process.env.DEPLOYMENT_HOST,
    NEW_USERS_NEED_ADMIN_APPROVABLE: Boolean(
      process.env.NEW_USERS_NEED_ADMIN_APPROVABLE === "true" ? true : false
    ),
    CONNECTION_STRING_DB: process.env.CONNECTION_STRING_DB,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);
export default sanitizedConfig;
