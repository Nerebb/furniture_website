import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../../libs/prismadb'
import { IRegister } from "@types"
import client from "../../../../libs/prismadb"

export default NextAuth({
    //Connect Prisma
    adapter: PrismaAdapter(prisma),

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
                const user = await client.user.findFirstOrThrow({
                    where: {
                        loginId: credentials?.loginId,
                        password: credentials?.password,
                    },
                })

                return user
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
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
    secret: process.env.SECRET,
    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `strategy` should be set to 'jwt' if no database is used.
        strategy: 'database',

        // Seconds - How long until an idle session expires and is no longer valid.
        // maxAge: 30 * 24 * 60 * 60, // 30 days
        maxAge: 10 * 24 * 60 * 60,

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        secret: process.env.SECRET,
    },
    debug: true,
})