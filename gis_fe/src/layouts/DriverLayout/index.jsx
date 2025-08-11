import React from "react";
import DriverHeader from "./components/Header";
import Footer from "./components/Footer";
const DriverLayout = ({ children }) => {
    return (
        <>
            <div className="h-screen ">
                <DriverHeader></DriverHeader>
                <main>{children}</main>
                <Footer></Footer>
            </div>

        </>
    )
}
export default DriverLayout