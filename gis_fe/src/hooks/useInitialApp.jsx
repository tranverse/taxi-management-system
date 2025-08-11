// import { setAccessToken, setIsLoging, setRole } from "@redux/slices/auth.slice";
// import AuthService from "@services/auth.service";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import env from "@configs/env.config";
// import { jwtDecode } from "jwt-decode";

// const useInitialApp = () => {
//     const dispatch = useDispatch();
//     const [userRole, setUserRole] = useState(null); // Lưu role của user sau khi decode token
//     const isLoging = useSelector((state) => state.auth.isLoging);
//     const token = useSelector((state) => state.auth.tokens?.accessToken);
//     const refreshTokenString = useSelector((state) => state.auth.tokens?.refreshToken);

//     // Hàm kiểm tra user hiện tại là khách hàng hay nhân viên
//     const getUserRole = (token) => {
//         try {
//             const decoded = jwtDecode(token);
//             setUserRole(decoded.scope)
//             return decoded?.scope || ""; // Trả về vai trò của user
//         } catch (error) {
//             console.error("Lỗi khi decode token:", error);
//             return "";
//         }
//     };

//     // Hàm refresh token cho khách hàng
//     const refreshTokenCustomer = async () => {
//         const [result, error] = await AuthService.refreshTokenCustomer();
//         if (error) {
//             console.error("Lỗi refresh token (customer):", error);
//             dispatch(setIsLoging(false));
//             return;
//         }
//         dispatch(setAccessToken(result.data.accessToken));
//         dispatch(setIsLoging(true));
//         dispatch(setRole(userRole))
//     };

//     // Hàm refresh token cho nhân viên
//     const refreshTokenUser = async () => {
//         const [result, error] = await AuthService.refreshTokenUser();
//         if (error) {
//             console.error("Lỗi refresh token (user):", error);
//             dispatch(setIsLoging(false));
//             return;
//         }
//         dispatch(setAccessToken(result.data.accessToken));
//         dispatch(setIsLoging(true))
//         dispatch(setRole(userRole))

//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!token) {
//                 // await refreshTokenCustomer(); 
//                 return;
//             }

//             const role = getUserRole(token);
//             setUserRole(role);
//             console.log(role)
//             if (role === "ROLE_CUSTOMER") {
//                 await refreshTokenCustomer();
//             } else if (role === "ROLE_ADMIN" || role === "ROLE_DRIVER") {
//                 await refreshTokenUser();
//             } else {
//                 console.warn("Không xác định được vai trò user");
//                 dispatch(setIsLoging(false));
//             }
//         };

//         fetchData();

//         if (!isLoging) return;

//         const intervalId = setInterval(() => {
//             if (userRole === "ROLE_CUSTOMER") {
//                 refreshTokenCustomer();
//             } else {
//                 refreshTokenUser();
//             }
//         }, env.interval_refresh_token);

//         return () => clearInterval(intervalId);
//     }, [dispatch, isLoging, refreshTokenString, token, userRole]);

//     return { userRole };
// };

// export default useInitialApp;

import { setAccessToken, setIsLoging, setRole } from "@redux/slices/auth.slice";
import AuthService from "@services/auth.service";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import env from "@configs/env.config";
import { jwtDecode } from "jwt-decode";

const useInitialApp = () => {
    const dispatch = useDispatch();
    const [userRole, setUserRole] = useState(null); 
    const isLoging = useSelector((state) => state.auth.isLoging);
    const token = useSelector((state) => state.auth.tokens?.accessToken);
    const refreshTokenString = useSelector((state) => state.auth.tokens?.refreshToken);
    
    // Hàm lấy role từ token
    const getUserRole = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded?.scope || "";
        } catch (error) {
            console.error("❌ Lỗi khi decode token:", error);
            return "";
        }
    };

    // Hàm refresh token cho khách hàng
    const refreshTokenCustomer = async () => {
        // if (!isLoging) return; // Ngăn chặn refresh khi đã logout
        const [result, error] = await AuthService.refreshTokenCustomer();
        if (error) {
            // console.error("❌ Lỗi refresh token (customer):", error);
            dispatch(setIsLoging(false));
            return;
        }
        const newToken = result.data.accessToken;
        dispatch(setAccessToken(newToken));

        const role = getUserRole(newToken);
        dispatch(setRole(role));
        localStorage.setItem("userRole", role);
        dispatch(setIsLoging(true));
    };

    // Hàm refresh token cho nhân viên / tài xế
    const refreshTokenUser = async () => {
        const [result, error] = await AuthService.refreshTokenUser();
        if (error) {
            console.error("❌ Lỗi refresh token (user/driver):", error);
            dispatch(setIsLoging(false));
            return;
        }
        const newToken = result.data.accessToken;
        dispatch(setAccessToken(newToken));

        const role = getUserRole(newToken);
        dispatch(setRole(role));
        localStorage.setItem("userRole", role); // Lưu vào localStorage
        dispatch(setIsLoging(true));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                await refreshTokenCustomer();
                return;
            }

            const role = getUserRole(token);
            setUserRole(role);
            dispatch(setRole(role));
            localStorage.setItem("userRole", role);

            if (role === "ROLE_CUSTOMER") {
                await refreshTokenCustomer();
            } else if (role === "ROLE_ADMIN" || role === "ROLE_DRIVER") {
                await refreshTokenUser();
            } else {
                dispatch(setIsLoging(false));
            }
        };

        fetchData();

        if (!isLoging) return;

        const intervalId = setInterval(() => {
            const role = localStorage.getItem("userRole");
            if (role === "ROLE_CUSTOMER") {
                refreshTokenCustomer();
            } else {
                refreshTokenUser();
            }
        }, env.interval_refresh_token);

        return () => clearInterval(intervalId);
    }, [dispatch, isLoging, refreshTokenString, token]);

    return { userRole };
};

export default useInitialApp;
