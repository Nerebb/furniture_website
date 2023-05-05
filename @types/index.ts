import { Gender, Role, User } from "@prisma/client"
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

export type UserProfile = {
    id: string;
    address?: string;
    nickName?: string;
    role: Role;
    gender: Gender;
    phoneNumber?: string;
    birthDay?: string;
    name?: string;
    email?: string;
    image?: string;
    userVerified?: boolean,
    emailVerified?: boolean,
    deleted?: boolean,
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
    content?: string | number | string[] | Date, //Type for deepInspec input type: <FormikSelect/> or <Input> mutate Date type
}

export interface contentRange {
    filter: string,
    curPage: number,
    totalPage: number,
}

export interface JsonColor { id: string, quantities: number }

export interface FilterSearch {
    id: number | number[],
    filter: 'id' | 'label',
    sort: 'asc' | 'desc',
    limit: number,
    skip: number,
}

export interface ColorSearch extends Omit<FilterSearch, 'id' | 'filter'> {
    id: string | string[]
    filter: 'hex' | 'label'
} 