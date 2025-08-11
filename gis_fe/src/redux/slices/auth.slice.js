import { createSlice } from "@reduxjs/toolkit";
import { getLS } from "@tools/localStorage.tool";
import { jwtDecode } from "jwt-decode";

const authSlice = createSlice({
    name: "auth",
    initialState: getLS("auth", {
        tokens: {accessToken: "", refreshToken: ""},
        user: null,
        isLoging: false,
        redirect: "/",
        role: "",
    }),
    reducers: {
        setToken(state, {payload}){
            state.tokens.accessToken = payload.accessToken
            state.tokens.refreshToken = payload.refreshToken
        },
        setAccessToken(state, {payload}){
            state.tokens.accessToken = payload
        },
        clearToken(state){
            state.tokens.accessToken = ""
            state.tokens.refreshToken = ""
            state.role = ""; 
        },
        setUser(state, {payload}){
            state.user = payload
        },
        clearUser(state){
            state.user = null
        },
        setIsLoging(state, {payload}){
            state.isLoging = payload
        },
        setRedirect(state, {payload}){
            state.redirect = payload
        },

        setRole(state, {payload}){
            state.role = payload
        }

    }
})

export const {
    setAccessToken,
    setIsLoging,
    setRedirect,
    clearToken,
    clearUser,
    setToken,
    setRole

 } = authSlice.actions

export default authSlice.reducer