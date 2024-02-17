
//import LineProvider from "next-auth/providers/line";
import { CONFIGURATION } from "@/constants";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


async function refreshAccessToken(token: any) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" + new URLSearchParams({
                client_id: CONFIGURATION.AUTH_PROVIDERS.GOOGLE.CLIENT_ID,
                client_secret: CONFIGURATION.AUTH_PROVIDERS.GOOGLE.CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            })

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: CONFIGURATION.AUTH_PROVIDERS.GOOGLE.CLIENT_ID,
            clientSecret: CONFIGURATION.AUTH_PROVIDERS.GOOGLE.CLIENT_SECRET,
            id: 'googleAuth2',
            name: 'Google',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    secret: CONFIGURATION.AUTH_PROVIDERS.JWT_SECRET,
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/sign-up",
    },
    callbacks: {
        async signIn({ account, credentials }: any) {
            const providerName: any = ['googleAuth2'];
            if (account && providerName.includes(account?.provider)) {
                return true
            }
            return false
        },
        async redirect({ url }) {
            return url;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.accessToken,
                    accessTokenExpires: Date.now() + (account as any).expires_in * 1000,
                    refreshToken: account.refresh_token,
                    user,
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token as any).accessTokenExpires) {
                return token
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token)
        },
        session: async ({ session, token }: { session: any, token: any }) => {
            if (token) {
                session.maxAge = 60 * 60;
                session.user = token.user
                session.accessToken = token.accessToken
                session.error = token.error
            }

            return session
        },

    }
});
