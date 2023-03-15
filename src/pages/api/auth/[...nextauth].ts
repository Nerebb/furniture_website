import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import NextAuth, { CallbacksOptions, NextAuthOptions, TokenSet } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prismaClient from "../../../libs/prismaClient"

//Google
const GOOGLE_AUTHORIZATION_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
    })

const refreshGoogleToken = async (token: JWT): Promise<JWT> => {
    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_ID,
                client_secret: process.env.GOOGLE_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
            }),
            method: "POST",
        })

        const tokens: TokenSet = await response.json()
        if (!response.ok) throw tokens

        return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token as string,
            expires_at: tokens.expires_at as number,
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
        }

    } catch (error) {
        console.error("Error refreshing access token", error)
        // The error property will be used client-side to handle the refresh token error
        return { ...token, error: "RefreshAccessTokenError" }
    }
}

const jwtGoogle: CallbacksOptions['jwt'] = async ({ token, account, user }) => {
    //Store Google respone
    let extendedToken;

    //1st login: account && user still valid
    if (account && user) {
        extendedToken = {
            ...token,
            access_token: account.access_token as string,
            expires_at: account.expires_at as number * 1000,
            refresh_token: account.refresh_token as string,
        }
        return extendedToken
    }

    //LaterCheck - Subsequent requests to check auth sessions
    if (Date.now() + 5000 < token.expires_at) {
        console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ')
        return token
    }

    console.log("Request GOOGLE to extendsToken")
    return await refreshGoogleToken(token)
}


export const authOptions: NextAuthOptions = {
    //Connect Prisma
    adapter: PrismaAdapter(prismaClient),

    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                loginId: { label: "Login ID", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                //checkUser
                const user: any = await prismaClient.account.findFirstOrThrow({
                    where: {
                        loginId: credentials?.loginId,
                    },
                })
                if (!user) throw new Error('Invalid User or password')

                //checkPassword
                const checkPassword = await compare(credentials!.password, user.password as string)
                if (!checkPassword) throw new Error('Password is incorrect')

                return user
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: GOOGLE_AUTHORIZATION_URL,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            allowDangerousEmailAccountLinking: true,

        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        /** JWT designFlow:
         * @On1st login: Credentials: do not store JWT, SignOn: Get JWT from provider
         *                - token : do not have iat,exp,jti
         *                - user : get Data from database
         *                - account: get res Data from signOn
         * @OnLater : - token: store iat,exp,jti
         *            - user && account: undefine
         *
         * @WhatIwantToDo :Refresh token if expires
         *
         * @JWTCallback : SignOn- autoRequest Provider again to extends token
         *                Credentials - token.exp equals session - which is already handled by nextAuth
         */
        async jwt({ token, account, user }) {
            if (account && user) {
                token.provider = account.provider
                token.role = user.role
                token.userId = user.userId
            }

            // //Refresh per SignOn response data
            // switch (token.provider) {
            //     case 'google':
            //         return await jwtGoogle({ token, account, user })
            //     default:
            //         break;
            // }
            return token
        },
        async session({ session, token, user }) {

            if (token && session.user) {
                session.user.role = token.role //Store userRole
                session.access_token = token.access_token;
                session.error = token.error || null; // null: NextJS Bugs: undefined cannot be read as JSON

                session.id = token.provider !== 'credentials' ? token.sub : token.userId; //AccountID
            }

            return session
        },
    },
    secret: process.env.SECRET,
    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `strategy` should be set to 'jwt' if no database is used.
        strategy: 'jwt',

        // Seconds - How long until an idle session expires and is no longer valid.
        // maxAge: 30 * 24 * 60 * 60, // 30 days
        maxAge: 10 * 24 * 60 * 60,
        // maxAge: 10

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        //Default maxAge is setted as session maxAge
        secret: process.env.SECRET,
    },
    debug: true,
}

export default NextAuth(authOptions)