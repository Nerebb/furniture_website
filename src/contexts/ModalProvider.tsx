import NotFoundPage from '@/components/NotFoundPage'
import Login from '@/components/static/Login'
import React, { useMemo, ReactNode, createContext, useReducer } from 'react'

type Props = {
    children: ReactNode
}

type TModalAction =
    | { type: 'close' }
    | { type: "login" }

type TModal = {
    isOpen: boolean,
    element: ReactNode
}

const ModalInit: TModal = {
    isOpen: false,
    element: <NotFoundPage />
}

function modalReducer(state: TModal, action: TModalAction): TModal {
    switch (action.type) {
        case "login":
            return { ...state, isOpen: true, element: <Login /> };
        default:
            return state;
    }
}

const ModalContext = createContext
    <{
        state: TModal;
        dispatch: React.Dispatch<TModalAction>;
    }>
    ({
        state: ModalInit,
        dispatch: () => null
    })

export default function ModalProvider({ children }: Props) {
    const [state, dispatch] = useReducer(modalReducer, ModalInit)

    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            {children}
        </ModalContext.Provider>
    )
}