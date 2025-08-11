import React from 'react'

const Header = ({columns}) => {
  return (
    <>
        <thead>
            <tr>
                {columns.map((col, index) => (
                    <th className='' key={index}>{col}</th>
                ))}
            </tr>
        </thead>
    </>
  )
}

export default Header