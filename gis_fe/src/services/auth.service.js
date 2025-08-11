import { getAuthUrl, getApiUrl } from "@tools/url.tool";
import axiosInstance, {service} from "@tools/axios.tool";
import storeRedux from "@redux/store.redux";

const AuthService = {
    customerLogin({email, password}){
        return service(axiosInstance.post(getAuthUrl("/login"), {email, password}))
    },
    refreshTokenCustomer(){
        const {refreshToken} = storeRedux.getState().auth.tokens
        return service(axiosInstance.post(getAuthUrl("/refresh-token-customer"), {refreshToken}))
    },
    refreshTokenUser(){
        const {refreshToken} = storeRedux.getState().auth.tokens
        return service(axiosInstance.post(getAuthUrl("/refresh-token-user"), {refreshToken}))
    },
    customerRegister(data){
        return service(axiosInstance.post(getAuthUrl("/register"), data))
    },
    userLogin({username, password, latitude, longitude}) {
        console.log(latitude)
        return service(axiosInstance.post(getAuthUrl("/login-user"), {username, password, latitude, longitude}))
    },
    logOutUser(refreshToken){
        return service(axiosInstance.post(getAuthUrl("/logout-user"), {refreshToken}))
    }
}

export default AuthService