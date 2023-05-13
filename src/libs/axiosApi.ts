import { stripeRes } from "@/pages/api/checkout"
import { ProductCard, ProductSearch } from "@/pages/api/products"
import { ProductDetail } from "@/pages/api/products/[productId]"
import { UserShoppingCart } from "@/pages/api/user/shoppingCart"
import { Gender, Status } from "@prisma/client"
import { Register, UserProfile } from "@types"
import axiosClient from "./axiosClient"
import { buildQuery } from "./utils/buildQuery"
import { NewReviewProps, ResponseReview, ReviewSearch } from "@/pages/api/review"
import { UpdateReview } from "@/pages/api/review/[reviewId]"
import { NewOrder, ResponseOrder } from "@/pages/api/order"


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
    //SignUp
    signUp: (props: Register) => Promise<{ message: string }>,

    //User
    getUser: () => Promise<UserProfile | undefined>,
    updateUser: (data: allowedField) => Promise<{ message: string }>,
    deleteUser: () => Promise<{ message: string }>

    //ShoppingCart
    getShoppingCart: () => Promise<UserShoppingCart>
    updateShoppingCart: (cartItemId: string, color?: string, quantities?: number) => Promise<{ message: string }>
    addToShoppingCart: (productId: string, color: string, quantities?: number) => Promise<{ message: string }>
    removeShoppingCart: (cartItemId: string) => Promise<{ message: string }>

    //ProductReview
    getReviews: ({ ...props }: ReviewSearch) => Promise<ResponseReview[]>
    createProductReview: (review: NewReviewProps) => Promise<{ message: string }>
    updateProductReview: (review: UpdateReview, likedUser?: boolean) => Promise<{ message: string }>
    deleteProductReview: (id: string) => Promise<{ message: string }>

    //Checkout-stripe;
    generateClient: (orderId: string) => Promise<stripeRes>

    //Wishlist
    getWishList: () => Promise<ProductCard[]>,
    addToWishList: (productId: string) => Promise<{ message: string }>,
    deleteWishlistProduct: (productId: string) => Promise<{ message: String }>,

    //Orders
    getUserOrders: (skip?: number, status?: Status) => Promise<ResponseOrder[]>,
    getOrderedProducts: (orderId: string) => Promise<ResponseOrder>,
    createNewOrder: ({ ...params }: NewOrder) => Promise<ResponseOrder>,
    checkIsOrdered: (productId: string) => Promise<boolean>,
    cancelUserOrder: (orderId: string) => Promise<{ message: string }>,


    //Product
    getFilter: (filter: typeof allowedFilter[number], limit?: number) => Promise<{ id: number | string, label: string }[]>,
    getProducts: ({ ...props }: ProductSearch) => Promise<ProductCard[]>,
    getProductById: (productId: string) => Promise<ProductDetail>,
}

const API_USER = '/api/user'
const API_USER_SHOPPINGCART = `${API_USER}/shoppingCart`
const API_USER_WISHLIST = `${API_USER}/wishlist`
const API_USER_ORDER = `/api/order`
const API_PRODUCT = '/api/products'
const API_CHECKOUT = 'api/checkout'
const API_PRODUCT_REVIEW = `/api/review`

const axios: AxiosApi = {
    //Auth
    signUp: async (values) => {
        try {
            const res: { message: string } = await axiosClient.post('api/auth/customSignup', values)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-CustomSignUp", error)
            throw error.message
        }
    },

    //User
    getUser: async () => {
        try {
            const res = await axiosClient.get(`${API_USER}/123`)
            return res.data
        } catch (error: any) {
            console.log('Axios-GetUser', error)
            throw error.message
        }
    },

    updateUser: async (data) => {
        try {
            const res = await axiosClient.put(`${API_USER}/123`, data)
            return res.data
        } catch (error: any) {
            console.log('Axios-UpdateUser', error)
            throw error.message
        }
    },

    deleteUser: async () => {
        try {
            const res: { message: string } = await axiosClient.delete(`${API_USER}/123`)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-deleteUser", error)
            throw error.message
        }
    },

    /**
     * @method GET
     * @description Get filter to filter products
     * @response {id,name,description}[]
     */

    getFilter: async (filter: typeof allowedFilter[number], limit?: number) => {
        try {
            const url = buildQuery(`/api/${filter}`, { limit })
            const res = await axiosClient.get(url)
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
            const res = await axiosClient.get(`${API_USER_ORDER}/${orderId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-getOrderedProducts", error)
            throw error.message
        }
    },

    createNewOrder: async ({ ...params }) => {
        try {
            const res = await axiosClient.post(API_USER_ORDER, { ...params })
            return res.data
        } catch (error: any) {
            console.log("Axios-createNewOrder", error)
            throw error.message
        }
    },

    cancelUserOrder: async (orderId) => {
        try {
            const res = await axiosClient.delete(`${API_USER_ORDER}/${orderId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-cancelUserOrder", error)
            throw error.message
        }
    },

    checkIsOrdered: async (productId) => {
        try {
            const res = await axiosClient.get(`${API_USER_ORDER}/checkOrder?productId=${productId}`)
            return res.data
        } catch (error: any) {
            console.log("Axios-checkIsOrdered", error)
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

    addToShoppingCart: async (productId, color, quantities) => {
        try {
            const res: { message: string } = await axiosClient.post(API_USER_SHOPPINGCART, { productId, color, quantities })
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-addToShoppingCart", error)
            throw error.message
        }
    },

    updateShoppingCart: async (cartItemId, color, quantities) => {
        try {
            const res: { message: string } = await axiosClient.put(API_USER_SHOPPINGCART, { cartItemId, color, quantities })
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

    //ProducReviews
    getReviews: async (props) => {
        try {
            const query = buildQuery(API_PRODUCT_REVIEW, props)
            const res = await axiosClient.get(query)
            return res.data
        } catch (error: any) {
            console.log("Axios-getReviewsById", error)
            throw error.message
        }
    },

    createProductReview: async (body) => {
        try {
            const res: { message: string } = await axiosClient.post(API_PRODUCT_REVIEW, body)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-createProductReview", error)
            throw error.message
        }

    },

    updateProductReview: async (params, likedUser) => {
        try {
            const res: { message: string } = await axiosClient.put(`${API_PRODUCT_REVIEW}/${params.id}`, { ...params, likedUser })
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-updateProductReview", error)
            throw error.message
        }
    },

    deleteProductReview: async (id) => {
        try {
            const res: { message: string } = await axiosClient.delete(`${API_PRODUCT_REVIEW}/${id}`)
            return { message: res.message }
        } catch (error: any) {
            console.log("Axios-deleteProductReview", error)
            throw error.message
        }
    },

    //Checkout-Stripe
    generateClient: async (orderId) => {
        try {
            const query = buildQuery(API_CHECKOUT, { orderId })
            const res: stripeRes = await axiosClient.post(query)
            return res
        } catch (error: any) {
            console.log("Axios-generateClient", error)
            throw error.message
        }
    }

}



export default axios