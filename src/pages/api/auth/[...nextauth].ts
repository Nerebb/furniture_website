import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import NextAuth, { CallbacksOptions, NextAuthOptions, TokenSet } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prismaClient from "../../../libs/prismaClient"
import { credentialLogin } from "./customLogin"

//Google
const GOOGLE_AUTHORIZATION_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
    })

/**
 * @description auth with Next-auth
 * @return session - cookies
 * @access credential - signOn: Google, Github
 */
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
                const user = await credentialLogin({ loginId: credentials?.loginId, password: credentials?.password })
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
        async jwt({ token, account, user }) {
            if (account && user) {
                token.provider = account.provider
                token.role = user.role
                token.userId = account.provider === 'credentials' ? user.id : token.sub
            }

            return token
        },
        async session({ session, token, user }) {

            if (token && session.user) {
                session.user.role = token.role //Store userRole
                session.access_token = token.access_token;
                session.error = token.error || null; // null: NextJS Bugs: undefined cannot be read as JSON

                session.id = token.userId; //AccountID
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