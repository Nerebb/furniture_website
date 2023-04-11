import { ProductCard, ProductSearch } from "@/pages/api/products"
import { ProductDetail } from "@/pages/api/products/[productId]"
import { OrderedItem, UserOrder, newOrder } from "@/pages/api/user/order"
import { UserShoppingCart } from "@/pages/api/user/shoppingCart"
import { Gender, Status } from "@prisma/client"
import { UserProfile } from "@types"
import axiosClient from "./axiosClient"
import { buildQuery } from "./utils/buildQuery"


export type allowedField = Omit<UserProfile,
    | 'image'
    | 'id'
    | 'role'
    | 'gender'
> & {
    gender?: Gender;
}
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
    createNewOrder: ({ ...params }: newOrder) => Promise<{ message: string }>
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
            const res = await axiosClient.get(`${API_USER}/${id}`)
            return res.data
        } catch (error: any) {
            console.log('Axios-GetUser', error)
            throw error.message
        }
    },

    updateUser: async (id, data) => {
        try {
            const res = await axiosClient.put(`${API_USER}/${id}`, data)
            return res.data
        } catch (error: any) {
            console.log('Axios-UpdateUser', error)
            throw error.message
        }
    },

    /**
     * @method GET
     * @description Get filter to filter products
     * @response {id,name,description}[]
     */

    getFilter: async (filter: typeof allowedFilter[number]) => {
        try {
            const res = await axiosClient.get(`/api/${filter}`)
            return res.data
        } catch (error: any) {
            console.log('Axios-getFilter', error)
            throw error.message
        }
    },

    //Products
    getProducts: async ({ ...props }) => {
        try {
            let query = buildQuery(API_PRODUCT, props);

            const res = await axiosClient.get(`${query}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-getProducts", error)
            throw error.message
        }
    },

    getProductById: async (productId) => {
        try {
            const res = await axiosClient.get(`${API_PRODUCT}/${productId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-getProductById", error)
            throw error.message
        }
    },

    //UserWishlist
    deleteWishlistProduct: async (productId) => {
        try {
            const res: { message: string } = await axiosClient.delete(`${API_USER_WISHLIST}?productId=${productId}`)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-deleteWishlistProduct", error)
            throw error.message
        }
    },

    addToWishList: async (productId) => {
        try {
            const res: { message: string } = await axiosClient.post(`${API_USER_WISHLIST}?productId=${productId}`)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-addToWishList", error)
            throw error.message
        }
    },

    getWishList: async () => {
        try {
            const res = await axiosClient.get(API_USER_WISHLIST)
            return res.data
        } catch (error: any) {
            console.log("Axios-getWishList", error)
            throw error.message
        }
    },

    //UserOrder
    getUserOrders: async (skip, status) => {
        try {
            const query = buildQuery(API_USER_ORDER, { skip, status })
            const res = await axiosClient.get(query)
            return res.data
        } catch (error: any) {
            console.log("Axios-getUserOrders", error)
            throw error.message
        }
    },

    getOrderedProducts: async (orderId) => {
        try {
            const query = buildQuery(API_USER_ORDER, { orderId })
            const res = await axiosClient.get(query)
            return res.data
        } catch (error: any) {
            console.log("Axios-getOrderedProducts", error)
            throw error.message
        }
    },

    createNewOrder: async ({ ...params }) => {
        try {
            const query = buildQuery(API_USER_ORDER, { ...params })
            const res: { message: string } = await axiosClient.put(query, params.orderItems)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-createNewOrder", error)
            throw error.message
        }
    },

    cancelUserOrder: async (orderId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_ORDER}?orderId=${orderId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-cancelUserOrder", error)
            throw error.message
        }
    },

    //UserShoppingCart
    getShoppingCart: async () => {
        try {
            const res = await axiosClient.get(`${API_USER_SHOPPINGCART}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-getShoppingCart", error)
            throw error.message
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
            const res: { message: string } = await axiosClient.post(query)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-updateShoppingCart", error)
            throw error.message
        }
    },

    removeShoppingCart: async (cartItemId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_SHOPPINGCART}?cartItemId=${cartItemId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-removeShoppingCart", error)
            throw error.message
        }
    },

}



export default axios