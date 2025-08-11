import React from 'react'

const ReadOnlyInput = ({ value, label, className }) => {
    return (
        <>
            <div className="w-full flex flex-col">
                <label htmlFor="" className="text-[12px] text-gray-600">{label}</label>
                <input type="text" value={value} readOnly
                    className={`${className} w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                                        focus:border-b-2 transition-colors duration-300 pl-0 `} />
            </div>
        </>
    )
}

export default ReadOnlyInput