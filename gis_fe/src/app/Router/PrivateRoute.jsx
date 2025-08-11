import CustomerLayout from "@layouts/CustomerLayout";
import DriverLayout from "@layouts/DriverLayout";
import UserLayout from "@layouts/UserLayout";
import { Fragment } from "react";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
    const isLoging = useSelector((state) => state.auth.isLoging);
    const role = useSelector((state) => state.auth.role);
    if (!isLoging) {
        if (role !== "ROLE_CUSTOMER") {
            return (
                <DriverLayout>
                    <h1 className="text-3xl font-bold text-blue-600 text-center mt-6 mb-55">
                        🚛 Tài xế vui lòng đăng nhập để tiếp tục nhận chuyến!
                    </h1>

                </DriverLayout>
            );
        }

        
    }

    return <Fragment>{children}</Fragment>;
}

export default PrivateRoute;
