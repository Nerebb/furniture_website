import { signIn, useSession } from 'next-auth/react'
import React from 'react'

type Props = {
    provider: string,
    callbackUrl?: string
}

const useRefreshToken = ({ provider, callbackUrl }: Props) => {
    const { data: session } = useSession()

    try {
        if (session?.error === "RefreshAccessTokenError") {
            signIn(provider, { callbackUrl }); // Force sign in to hopefully resolve error
        }

        return true
    } catch (error) {
        console.log("refreshTokenHooks", error)
    }
}