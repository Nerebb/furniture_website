import { Gender, User } from "@prisma/client"
import { HTMLInputTypeAttribute } from "react"

export interface Image {
    id: number | string
    url: string
}

export enum ApiMethod {
    POST = "POST",
    GET = 'GET',
    PUT = 'PUT',
    DELETE = "DELETE",
}

export interface Login {
    loginId: string
    password: string
}

export interface Register extends Login {
    //RegisterForm
    confirmPassword?: string
    email: string
}

export type UserProfile = Omit<User,
    | 'userVerified'
    | 'createdDate'
    | 'updatedAt'
    | 'deleted'
    | 'emailVerified'
>

export interface IProduct {
    id: number | string
    name: string
    description: string
    color: string
    price: number
    category: string[]
    shiper?: UserProfile["id"]
    imageUrl: Image["url"][]
    available: number
    createdDate: string
    updatedDate: string
}

export interface Category {
    id: number | string
    name: string
    description: string
    totalSale: number
}

export interface FormRow {
    id: number | string,
    label: string,
    name: string,

    inputType?: HTMLInputTypeAttribute,
    content?: string | number | string[] | Date,
}
