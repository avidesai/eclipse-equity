declare const environment: {
    NODE_ENV: string;
    PORT: string | number;
    MONGODB_URI: string | undefined;
    JWT_SECRET: string | undefined;
    CLIENT_URLS: string[];
    STRIPE_SECRET_KEY: string | undefined;
    STRIPE_WEBHOOK_SECRET: string | undefined;
    GOOGLE_CLIENT_ID: string | undefined;
    GOOGLE_CLIENT_SECRET: string | undefined;
    SENDGRID_API_KEY: string | undefined;
    EMAIL_USER: string | undefined;
    CLIENT_URL: string;
};
export default environment;
