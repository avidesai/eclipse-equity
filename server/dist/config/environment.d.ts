declare const environment: {
    NODE_ENV: string;
    PORT: string | number;
    MONGO_URI: string | undefined;
    JWT_SECRET: string | undefined;
    CLIENT_URLS: string[];
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        priceId: string | undefined;
    };
    GOOGLE_CLIENT_ID: string | undefined;
    GOOGLE_CLIENT_SECRET: string | undefined;
    SENDGRID_API_KEY: string | undefined;
    EMAIL_USER: string | undefined;
    CLIENT_URL: string;
};
export default environment;
