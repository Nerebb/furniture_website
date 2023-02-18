
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

export interface IRegiser {
    name: IUser['name']
    password: IUser['password']
    email: IUser['email']
    phoneNumber: IUser['phoneNumber']
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