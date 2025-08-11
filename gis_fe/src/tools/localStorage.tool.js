function setLS(key, value){
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return value
    } catch (error) {
        console.log(`Error setting localstorage key ${key}: `, error)
    }
}

function getLS(key, defaultValue){
    try {
        const value = localStorage.getItem(key)
        if(!value){
            localStorage.setItem(key, JSON.stringify(defaultValue))
            return defaultValue
        }
        return JSON.parse(value)
    } catch (error) {
        console.log(`Error getting localstorage key ${key}: `, error)
        return defaultValue;
    }
}

export {setLS, getLS}