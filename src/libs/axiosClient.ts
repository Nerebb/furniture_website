import axios from 'axios'

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
})
//Catch res Error
axiosClient.interceptors.request.use(
    async (request) => {
        console.log("REQUESTING", request.url)
        return request
    },
    (error) => {
        console.log("REQUEST ERROR", { error })
        return Promise.reject(error)
    }
)

//Destructuring - get the data only
axiosClient.interceptors.response.use(
    async (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error) => {
        console.log("RESPONSE ERROR", error.response);
        const message = error.response?.data?.message || "Unknown Error";
        return Promise.reject({ message });
    }
);

export default axiosClient