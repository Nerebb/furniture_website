import { HTMLInputTypeAttribute } from "react"

export interface Image {
    id: number | string
    url: string
}

export enum Role {
    admin = "admin",
    creator = "creator",
    customer = "customer"
}

export enum Gender {
    male = 'male',
    female = 'female',
    others = 'others',
}

export interface IRegister {
    loginId: IUser['name']
    password: IUser['password']
    confirmPassword?: IUser['password']
    email?: IUser['email']
    gender?: Gender
}


export interface IUser {
    id?: number
    name: string
    password: string
    nickName: string
    address: string
    email: string
    gender: Gender
    phoneNumber: number
    birthDay?: string
    wishList?: IProduct[]
    purchased?: IProduct[]

    role?: Role,
}

export interface IProduct {
    id: number | string
    name: string
    description: string
    color: string
    price: number
    category: string[]
    shiper?: IUser["id"]
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

export interface UserProfile {
    id: number,
    label: string,
    name: string,

    inputType?: HTMLInputTypeAttribute,
    content?: string | number | string[],
}
