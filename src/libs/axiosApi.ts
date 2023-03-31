import { ProductCard, ProductSearch } from "@/pages/api/products"
import { ProductDetail } from "@/pages/api/products/[productId]"
import { OrderedItem, UserOrder } from "@/pages/api/user/order"
import { UserShoppingCart } from "@/pages/api/user/shoppingCart"
import { Status } from "@prisma/client"
import { UserProfile } from "@types"
import axiosClient from "./axiosClient"
import { buildQuery } from "./utils/buildQuery"


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

    //ShoppingCart
    getShoppingCart: () => Promise<UserShoppingCart>
    updateShoppingCart: (cartItemId: string, color?: string, quantities?: number) => Promise<{ message: string }>
    addToShoppingCart: (productId: string, color: string, quantities?: number) => Promise<{ message: string }>
    removeShoppingCart: (cartItemId: string) => Promise<{ message: string }>

    //Wishlist
    getWishList: () => Promise<ProductCard[]>,
    addToWishList: (productId: string) => Promise<{ message: string }>,
    deleteWishlistProduct: (productId: string) => Promise<{ message: String }>,

    //Orders
    getUserOrders: (skip?: number, status?: Status) => Promise<UserOrder[]>,
    getOrderedProducts: (orderId: string) => Promise<OrderedItem[]>,
    cancelUserOrder: (orderId: string) => Promise<{ message: string }>,


    //Product
    getFilter: (filter: typeof allowedFilter[number]) => Promise<{ id: number | string, label: string }[]>,
    getProducts: ({ ...props }: ProductSearch) => Promise<ProductCard[]>,
    getProductById: (productId: string) => Promise<ProductDetail>,
}

const API_USER = '/api/user'
const API_USER_SHOPPINGCART = `${API_USER}/shoppingCart`
const API_USER_WISHLIST = `${API_USER}/wishlist`
const API_USER_ORDER = `${API_USER}/order`
const API_PRODUCT = '/api/products'

const axios: AxiosApi = {
    //User
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

    //Products
    getProducts: async ({ ...props }) => {
        try {
            let query = buildQuery(API_PRODUCT, props);

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

    //UserWishlist
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

    getWishList: async () => {
        try {
            const res = await axiosClient.get(API_USER_WISHLIST)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    //UserOrder
    getUserOrders: async (skip, status) => {
        try {
            let query = buildQuery(API_USER_ORDER, { skip, status })

            const res = await axiosClient.get(query)
            return res.data
        } catch (error) {
            console.log("Axios-getWishList", error)
        }
    },

    getOrderedProducts: async (orderId) => {
        try {
            const query = buildQuery(API_USER_ORDER, { orderId })
            const res = await axiosClient.get(query)
            return res.data
        } catch (error) {
            console.log("Axios-getOrderedProducts", error)
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

    //UserShoppingCart
    getShoppingCart: async () => {
        try {
            const res = await axiosClient.get(`${API_USER_SHOPPINGCART}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-getShoppingCart", error)
        }
    },

    addToShoppingCart: async (productId, color, quanitities) => {
        try {
            const query = buildQuery(API_USER_SHOPPINGCART, { productId, color, quanitities })
            const res: { message: string } = await axiosClient.put(query)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-addToShoppingCart", error)
            throw error.message
        }
    },

    updateShoppingCart: async (cartItemId, color, quantities) => {
        try {
            const query = buildQuery(API_USER_SHOPPINGCART, { cartItemId, color, quantities })
            const res = await axiosClient.post(query)
            return res.data
        } catch (error: any) {
            console.log("Axios-updateShoppingCart", error)
        }
    },

    removeShoppingCart: async (cartItemId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_SHOPPINGCART}?cartItemId=${cartItemId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-removeShoppingCart", error)
        }
    },

}



export default axios