import React from "react";
import UserHeader from "@layouts/DriverLayout/components/Header";
const UserAuthLayout = ({ children }) => {
    return (
        <>  
         <UserHeader></UserHeader>

            <div className="h-screen flex items-center justify-center">
                {children}
            </div>
        </>
    )
}

export default UserAuthLayout;