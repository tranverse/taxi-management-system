import env from "./env.config";

const ROUTE_TYPES = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE"
}

const SERVER_URL = {
    API: `${env.serverUrl}`,
    AUTH: `${env.serverUrl}/auth`,
    OAUTH2_GOOGLE: `${env.serverUrl}/oauth2/authorization/google`
}

export {ROUTE_TYPES, SERVER_URL}