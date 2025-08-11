import React, { useContext, useEffect, useState } from "react";
import { FormContext } from ".";
import { FaRegEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { TEInput } from 'tw-elements-react'

const Field = ({ type, name, className, placeholder, defaultValue, label }) => {
    const [isPassword, setIsPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setIsPassword(!isPassword)
    }
    const { data, handleInputChange } = useContext(FormContext)
    useEffect(() => {
        handleInputChange({ target: { name, value: defaultValue } })
    }, [defaultValue])

    return (
        <>
           
           <div className=" relative">
                <TEInput
                    type={type == "password" && isPassword ? "text" : type}
                    label={label}
                    size="lg"
                    className="mb-0 pd-0 pr-10"
                    onChange={handleInputChange}
                    name={name}
                    placeholder={placeholder}
                />
                {type == "password" && (
                    <button type='button' onClick={togglePasswordVisibility}
                        className='absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500' >
                        {isPassword ? <FaRegEye /> : <LuEyeClosed />}

                    </button>
                )}
            </div>
        </>
    )
}
export default Field;