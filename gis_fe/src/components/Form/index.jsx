import React, { useState } from "react";
import Field from "./Field";
import SelectOption from "./SelectOption";
const FormContext = React.createContext();

const Form = ({children, onSubmit, className}) => {
    const [data, setData] = useState({})
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        await Promise.all([
            onSubmit(data),
            new Promise((reslove) => setTimeout(reslove,1000))
        ])
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target

        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return(
        <FormContext.Provider value={{data, handleInputChange}}>
            <form onSubmit={handleSubmit} className={className}>{children}</form>
        </FormContext.Provider>
    )
}

export { Form, FormContext, Field, SelectOption}