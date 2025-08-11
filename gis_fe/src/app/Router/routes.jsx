import { Fragment } from "react";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import UserLayout from "@layouts/UserLayout";
import Dashboard from "@pages/user/Dashboard";
import CustomerLogin from "@pages/auth/CustomerLogin";
import AuthLayout from "@layouts/AuthLayout";
import ReceiveToken from "@pages/auth/ReceiveToken";
import Home from "@pages/customer/Home";
import CustomerLayout from "@layouts/CustomerLayout";
import DiverPartner from "@pages/customer/DriverPartner";
import CustomerRegister from "@pages/auth/CustomerRegister";
import ConfirmBooking from "@pages/customer/ConfirmBooking";
import Booking from "@pages/customer/Booking";
import AcceptBookking from "@pages/driver/AcceptBooking";
import UserLogin from "@pages/auth/UserLogin";
import Trip from "@pages/customer/Trip";
import DriverTrip from "@pages/driver/DriverTrip";
import Review from "@components/Review";
import BookingList from "@pages/customer/BookingList";
import BookingDetail from "@pages/customer/BookingDetail";
import DriverDetail from "@pages/driver/DriverDetail";
import TrackingTrip from "@pages/user/TrackingTrip";
import DriverList from "@pages/user/DriverList";
import DriverDetailUser from "@pages/user/DriverDetailUser";
import BookingDetailOfDriver from "@pages/driver/BookingDetailOfDriver";
import BookingDetailUser from "@pages/user/BookingDetailUser";
import DriverLayout from "@layouts/DriverLayout";
import UserAuthLayout from "@layouts/AuthLayout/UserAuthLayout";
import DriverRevenue from "@pages/driver/DriverRevenue";
import DriverRevenueUser from "@pages/user/DriverRevenueUser";
const ROUTE_TYPE = {
    PUBLIC: PublicRoute,
    PRIVATE: PrivateRoute
}

const routes = [
    // User
    {
        path: "/user/login",
        Page: UserLogin,
        Layout: UserAuthLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Đăng nhập"
    },
    {
        path: "/user/dashboard",
        Page: Dashboard,
        Layout: UserLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Dashboard"
    },
    , {
        path: "/driver/booking",
        Page: AcceptBookking,
        Layout: DriverLayout, 
        type: ROUTE_TYPE.PRIVATE,
        title: "Đặt xe"
    },
    , {
        path: "/driver/trip",
        Page: DriverTrip,
        Layout: DriverLayout,
        type: ROUTE_TYPE.PRIVATE,
        title: "Lộ trình"
    },
    , {
        path: "/driver/statistic",
        Page: DriverRevenue,
        Layout: DriverLayout,
        type: ROUTE_TYPE.PRIVATE,
        title: "Doanh thu"
    },
    , {
        path: "/driver-detail",
        Page: DriverDetail,
        Layout: DriverLayout,
        type: ROUTE_TYPE.PRIVATE,
        title: "Thông tin cá nhân"
    },
    , {
        path: "/user/driver-trip/:driverId",
        Page: TrackingTrip,
        Layout: UserLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Chuyến xe đang thực hiện"
    },
    {
        path: "/user/all-drivers",
        Page: DriverList,
        Layout: UserLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Danh sách tài xế"
    },
    {
        path: "/user/driver-detail/:driverId",
        Page: DriverDetailUser,
        Layout: UserLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Chi tiết tài xế"
    },
    {
        path: "/driver/booking-detail/:bookingId",
        Page: BookingDetailOfDriver,
        Layout: DriverLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Chi tiết chuyến xe"
    },
    {
        path: "/user/driver/booking-detail/:bookingId",
        Page: BookingDetailUser,
        Layout: UserLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Chi tiết chuyến xe"
    },
    , {
        path: "/user/driver-statistic/:driverId",
        Page: DriverRevenueUser,
        Layout: UserLayout,
        type: ROUTE_TYPE.PRIVATE,
        title: "Doanh thu"
    },
    // customer
    {
        path: "/login",
        Page: CustomerLogin,
        Layout: AuthLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Đăng nhập"
    },
    {
        path: "/register",
        Page: CustomerRegister,
        Layout: AuthLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Đăng ký"
    },
    {
        path: "/auth/receive-tokens",
        Page: ReceiveToken,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Nhận tokens"
    },
    {
        path: "/",
        Page: Home,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Trang chủ"
    },
    {
        path: "/diver-partner",
        Page: DiverPartner,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Đối tác tài xế"
    },
    {
        path: "/confirm-booking",
        Page: ConfirmBooking,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Xác nhận đặt xe"
    }
    , {
        path: "/booking",
        Page: Booking,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Đặt xe"
    }
    , {
        path: "/trip",
        Page: Trip,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Lộ trình"
    },

    , {
        path: "/booking-list",
        Page: BookingList,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Danh sách chuyến xe"
    }
    , {
        path: "/booking/detail/:bookingId",
        Page: BookingDetail,
        Layout: CustomerLayout,
        type: ROUTE_TYPE.PUBLIC,
        title: "Chi tiết chuyến xe"
    }
]

export default routes.map((route) => {
    const { Layout, Page, title } = route
    return {
        path: route.path,
        type: route.type,
        title: title,
        element: (
            <Layout>
                <Page></Page>
            </Layout>
        )
    }
})