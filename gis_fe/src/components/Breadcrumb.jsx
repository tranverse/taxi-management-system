import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Car, User, BadgeCheck, Route } from "lucide-react";
import { BiMoneyWithdraw } from "react-icons/bi";

const iconMap = {
    home: <Home className="w-5 h-5 text-blue-500" />,
    booking: <Car className="w-5 h-5 text-green-500" />,
    profile: <User className="w-5 h-5 text-purple-500" />,
    confirm: <BadgeCheck className="w-5 h-5 text-yellow-500" />,
    route: <Route className="w-5 h-5 text-red-500" />,
    revenue: <BiMoneyWithdraw className="w-5 h-5 text-yellow-500" />
}

const Breadcrumb = ({ routes = [], role = 'CUSTOMER' }) => {
    return (
        <nav className="flex items-center text-base text-gray-700 py-3 mx-30 mt-5">
            {
                role == "CUSTOMER" ? (

                    <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 font-semibold">
                        <Home className="w-5 h-5 text-blue-500" />
                        Trang chủ
                    </Link>
                ) : (
                    <Link to="/driver/booking" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 font-semibold">
                        <Home className="w-5 h-5 text-blue-500" />
                        Chuyến xe
                    </Link>
                )
            }
            {routes.length > 0 &&
                routes.map((route, index) => {
                    const isLast = index === routes.length - 1;
                    return (
                        <div key={route.path} className="flex items-center">
                            <ChevronRight className="w-5 h-5 mx-2 text-gray-400 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                            {!isLast ? (
                                <Link
                                    to={route.path}
                                    className="group flex items-center gap-2 text-gray-700 hover:text-blue-500 font-semibold capitalize"
                                >
                                    {iconMap[route.icon] || null}
                                    {route.name}
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-gray-900 font-bold capitalize">
                                    {iconMap[route.icon] || null}
                                    {route.name}
                                </span>
                            )}
                        </div>
                    );
                })}
        </nav>
    );
};

export default Breadcrumb;
