import { ProductCard, ProductSearch } from "@/pages/api/products"
import { ProductDetail } from "@/pages/api/products/[productId]"
import { UserOrder } from "@/pages/api/user/order"
import { UserProfile } from "@types"
import axiosClient from "./axiosClient"


export type allowedField = Omit<UserProfile,
    | 'image'
    | 'id'
    | 'email'
    | 'role'
>
export const allowedFilter = ['category', 'color', 'room'] as const

type AxiosApi = {
    //User
    getUser: (id: string) => Promise<UserProfile | undefined>,
    updateUser: (id: string, data: allowedField) => Promise<{ message: string }>,

    //Wishlist
    getWishList: () => Promise<ProductCard[]>,
    addToWishList: (productId: string) => Promise<{ message: string }>,
    deleteWishlistProduct: (productId: string) => Promise<{ message: String }>,

    //Orders
    getUserOrders: () => Promise<UserOrder[]>,
    cancelUserOrder: (orderId: string) => Promise<{ message: string }>,


    //Product
    getFilter: (filter: typeof allowedFilter[number]) => Promise<{ id: number | string, label: string }[]>,
    getProducts: ({ ...props }: ProductSearch) => Promise<ProductCard[]>
    getProductById: (productId: string) => Promise<ProductDetail>
}

const API_USER = '/api/user'
const API_USER_WISHLIST = `${API_USER}/wishlist`
const API_USER_ORDER = `${API_USER}/order`
const API_PRODUCT = '/api/products'

const axios: AxiosApi = {
    //User Route
    getUser: async (id) => {
        try {
            const data = await axiosClient
                .get(`${API_USER}/${id}`)
                .then(res => res.data)
            return data
        } catch (error) {
            console.log('Axios-GetUser', error)
        }
    },

    updateUser: async (id, data) => {
        try {
            const res = await axiosClient.put(`${API_USER}/${id}`, data)
            return res.data
        } catch (error) {
            console.log('Axios-UpdateUser', error)
        }
    },

    /**
     * @method GET
     * @description Get filter to filter products
     * @response {id,name,description}[]
     */

    getFilter: async (filter: typeof allowedFilter[number]) => {
        if (!allowedFilter.includes(filter)) throw new Error('Invalid Filter')
        try {
            const data = await axiosClient
                .get(`/api/${filter}`)
                .then(res => res.data)
            return data
        } catch (error) {
            console.log('Axios-GetFilter', error)
        }
    },

    getProducts: async ({ ...props }) => {
        try {
            let query = '';
            const propKeys = Object.keys(props)

            //Build queryParams
            for (let i = 0; i < propKeys.length; i++) {
                const curKey = propKeys[i] as keyof ProductSearch
                const value = props[curKey]
                if (Array.isArray(value)) {
                    value.forEach(i => query += `${curKey}=${i}&`)
                } else if (value) { query += `${curKey}=${value}&` }
            }

            const data = await axiosClient
                .get(`${API_PRODUCT}?${query}`)
                .then(res => res.data)
            return data
        } catch (error) {
            console.log("Axios-getProducts", error)
        }
    },

    getProductById: async (productId) => {
        try {
            const res = await axiosClient.get(`${API_PRODUCT}/${productId}`)
            return res.data
        } catch (error) {
            console.log("Axios-getProductById", error)
        }
    },

    getWishList: async () => {
        try {
            const res = await axiosClient.get(API_USER_WISHLIST)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    getUserOrders: async () => {
        try {
            const res = await axiosClient.get(API_USER_ORDER)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    cancelUserOrder: async (orderId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_ORDER}?orderId=${orderId}`)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    deleteWishlistProduct: async (productId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_WISHLIST}?productId=${productId}`)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    addToWishList: async (productId) => {
        try {
            const res = await axiosClient.post(`${API_USER_WISHLIST}?productId=${productId}`)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

}



export default axios