import { setToken } from "@redux/slices/auth.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReceiveTokenCustomer = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const redirect = useSelector((state) => state.auth.redirect)
    const dispatch = useDispatch()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const accessToken = queryParams.get("accessToken")
        const refreshToken = queryParams.get("refreshToken")

        if(accessToken && refreshToken){
            dispatch(setToken({accessToken, refreshToken}))
            navigate(redirect)
            toast.success("Đăng nhập thành công")
        }else{
            console.log("Lỗi thiếu token")
        }
    }, [location, navigate])

    return null
}

export default ReceiveTokenCustomer