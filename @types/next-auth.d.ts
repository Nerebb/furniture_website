import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        id?: string
        access_token: string
        user: {
            role: Role
        } & DefaultSession["user"]
        error: "RefreshAccessTokenError" | null

    }
    interface User {
        userId?: string
        role: Role
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: Role
        userId?: string
        provider: string
        access_token: string
        expires_at: number
        refresh_token: string
        error: "RefreshAccessTokenError" | null
    }
}
