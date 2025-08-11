import React from 'react'

const Heading = ({message, className}) => {
  return (
    <>
        <div className='mt-5'>
            <h1 className={`text-center font-bold  uppercase text-blue-400 ${className}`}>{message}</h1>
        </div>
    </>
  )
}

export default Heading