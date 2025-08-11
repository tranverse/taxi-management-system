import React from "react";
import CustomerHeader from "./components/Header";
import Footer from "./components/Footer";

const CustomerLayout = ({ children }) => {
    return (
        <>
            <div className="h-screen ">
                <CustomerHeader></CustomerHeader>
                <main>{children}</main>
                <Footer></Footer>
            </div>

        </>
    )
}
export default CustomerLayout