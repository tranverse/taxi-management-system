import React from "react";
import Header from "@layouts/CustomerLayout/components/Header";
const AuthLayout = ({ children }) => {
    return (
        <>  
         <Header></Header>

            <div className="h-screen flex items-center justify-center">
                {children}
            </div>
        </>
    )
}

export default AuthLayout;