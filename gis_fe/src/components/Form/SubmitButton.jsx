import React from "react";

const SubmitButton = ({children, className, disabled=false, onClick }) => {
    const handleClick = (e) => {
        if(disabled){
            e.preventDefault()
            return
        }
        onClick?.(e)
    }

    return(
        <>
            {/* <button type="submit" disabled={disabled}
            className={`${className} w-full shadow-lg  p-3 rounded font-semibold uppercase text-sm transition cursor-pointer
                        duration-200 ease-in-out hover:bg-[#55acee] hover:shadow-[0_0_10px_5px_rgba(156,188,231,0.5)]
                        leading-normal `}>{children}</button> */}
            <button type="submit" disabled={disabled} onClick={handleClick}
            className={`${className} w-full shadow-lg  p-3 rounded font-semibold uppercase text-sm transition 
                        duration-200 ease-in-out leading-normal `}>{children}</button>
        </>
    )
}

export default SubmitButton