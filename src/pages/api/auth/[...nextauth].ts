
//import LineProvider from "next-auth/providers/line";
import { API_ENDPOINTS, CONFIGURATION } from "@/constants";
import { notificationController } from "@/controllers/notification.controller";
import { IAuthResponse } from "@/interfaces";
import { Post } from "@/modules/fetch";
import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
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
        CredentialsProvider({
            id: "credentials-sign-in",
            name: 'Credentials',
            credentials: {
                phone: {},
                password: {},
            },
            async authorize(credentials) {
             return await Post(API_ENDPOINTS.AUTH.SIGN_IN, credentials, { skipHandleError: false }) as any
            }
        }),

    ],
    secret: CONFIGURATION.AUTH_PROVIDERS.JWT_SECRET,
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/sign-up",
    },
    callbacks: {
        async signIn({ account }: any) {
            if (account && account.provider === 'googleAuth2') {
                return true
            }
            else if (account && account.provider === 'credentials-sign-in') {
                return true
            }
            return false
        },
        async redirect({ url }) {
            return url;
        },
        async jwt({ token, user, account }) {
            if (account && (account as any).provider === 'credentials-sign-in') {
                return {
                    accessToken: (user as any).jwt,
                    user: (user as any).userInfo
                }
            }

            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token ?? (user as any)?.jwt,
                    accessTokenExpires: (account as any).expires_in ? Date.now() + (account as any).expires_in * 1000
                        : (token as any)?.user?.jwt,
                    refreshToken: account.refresh_token,
                    user: user ?? (token as any).user.userInfo,
                }
            }
            return token
        },
        session: async ({ session, token }: { session: any, token: any }) => {
            if (token) {
                session.maxAge = 60 * 60 * 24;
                session.user = token.user
                session.accessToken = token.accessToken
                session.error = token.error
            }
            return session
        },

    }
});
