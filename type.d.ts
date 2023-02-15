

export interface Image {
    id: number | string
    url: string
}

export interface IUser {
    id?: number | string
    name: string
    nickName: string
    address: string
    email: string
    gender: 'male' | 'female' | 'others'
    phoneNumber: number
    birthDay: string
    wishList?: IProduct[]
    purchased?: IProduct[]
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