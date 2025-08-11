import React, { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
const UserLayout = ({ children }) => {
    return (
        <>
            <div className="flex h-screen">
                <Navbar />
                <div className="flex flex-col flex-1 bg-gray-100">
                    <Header />
                    <main className="flex-1 overflow-auto">{children}</main>
                </div>
            </div>
        </>
    )
}

export default UserLayout;