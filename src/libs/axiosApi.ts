import { ProductCard, ProductSearch } from "@/pages/api/products"
import { UserProfile } from "@types"
import axiosClient from "./axiosClient"


export type allowedField = Omit<UserProfile,
    | 'image'
    | 'id'
    | 'email'
    | 'role'
>
const allowedFilter = ['category', 'color', 'room'] as const

type AxiosApi = {
    //UserApi
    getUser: (id: string) => Promise<UserProfile | undefined>,
    updateUser: (id: string, data: allowedField) => Promise<{ message: string }>,

    //ProductApi
    getFilter: (filter: typeof allowedFilter[number]) => Promise<{ id: number | string, name: string }[]>,
    getProducts: ({ ...props }: ProductSearch) => Promise<ProductCard[]>
}

const API_USER = '/api/user'
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

    getFilter: async (filter) => {
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
}



export default axios