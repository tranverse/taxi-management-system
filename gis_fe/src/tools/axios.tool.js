import axios from "axios";
import env from "@configs/env.config";
import storeRedux from "@redux/store.redux";
import _ from "lodash";

const axiosInstance = axios.create({
    baseURL: env.serverUrl,
    headers: {
        "Content-Type": "application/json"
    }
});
// Interceptor giúp chặn yêu cầu trước khi gửi đi, dùng để thêm accessToken vào header.


axiosInstance.interceptors.request.use(
    (config) => {
        const {accessToken} = storeRedux.getState().auth.tokens;
        if(accessToken){            
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
// axiosPromise: Request API (ví dụ axios.get("/users")).
export async function service(axiosPromise, getData = false) {
    try {
        const response = await axiosPromise;
        // console.log(axiosPromise)
        const result = getData ? _.get(response, "data.data") : {...response.data, status: response.status};
        // console.log(result)
        return [result, null]
    } catch (error) {
        // console.log(error)
        const errorResponse = error.response ? {...error.response.data, status: error.response.status} : { message: error.message, status: error.code || 500 };
        return [null, errorResponse]
    }
}

export default axiosInstance