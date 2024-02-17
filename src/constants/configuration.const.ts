export const CONFIGURATION = {
    AUTH_PROVIDERS: {
        GOOGLE: {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
        },
        JWT_SECRET: process.env.JWT_SECRET,
    },
}
