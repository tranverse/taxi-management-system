import { SERVER_URL } from "@configs/const.config";

const getApiUrl = (path) => {
    return `${SERVER_URL.API}${path}`
}

const getAuthUrl = (path) => {
    return `${SERVER_URL.AUTH}${path}`
}

export {getApiUrl, getAuthUrl}