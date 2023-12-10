namespace NodeJS {
  interface ProcessEnv {
    SERVICE_NAME: string;
    PORT: string;
    BASE_URL: string;
    NODE_ENV: string;
    DEFAULT_PAGE_SIZE: string;
    DEFAULT_PAGE_NUMBER: string;
    TYPE: string;
    HOST: string;
    PORT: string;
    USERNAME: string;
    PASSWORD: string;
    INSTANCE: string;
    TOKEN_KEYS_PATH: string;
    TOKEN_PRIVATE_KEY_NAME: string;
    TOKEN_PUBLIC_KEY_NAME: string;
    TOKEN_EXPIRY_DURATION_IN_SECONDS: string;
    SALT_ROUNDS: string;
    USERS_IMAGES_DIRECTORY_PATH: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER_NAME: string;
    SMTP_PASSWORD: string;
    SMTP_REDIRECTION_URL: string;
    SMTP_SENDER: string;
    CONTACT_US_URL: string;
    COMPANY_NAME: string;
    PRODUCT_NAME: string;
    LOGGING_DIRECTORY: string;
    TOKEN_SECRET_KEY: string;
    NEW_USERS_NEED_ADMIN_APPROVABLE: string;
  }
}
