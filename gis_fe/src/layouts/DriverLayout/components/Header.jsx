import React, { useEffect, useState } from "react";

import VTaxiLogo from "@assets/images/logo/VTaxi-100x100.ico";
import { Link, redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLS } from "@tools/localStorage.tool";
import { Col, Row, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AuthService from "@services/auth.service";
import { setIsLoging, setToken } from "@redux/slices/auth.slice";
import DriverService from "@services/Driver.service";

const DriverHeader = () => {
    const dispatch = useDispatch()
    const isLoging = useSelector((state) => state.auth.isLoging)
    const role = useSelector((state) => state.auth.role)
    const { refreshToken } = useSelector((state) => state.auth.tokens)
    const [driver, setDriver] = useState({})

    const handleLogoutUser = async () => {
        const [response, error] = await AuthService.logOutUser(refreshToken)
        if (error) {
            console.log("Đăng xuất không thành công: ", error)
            return
        }
        dispatch(setToken({ accessToken: "", refreshToken: "" })); 

    };

    const fetchDriverInfo = async () => {
        const [response, error] = await DriverService.getDriverInfo()
        if (error) {
            console.log("Lỗi khi lấy thông tin tài xế: ", error)
            return
        }
        setDriver(response.data)
    }
    useEffect(() => {
        fetchDriverInfo()
    }, [])
    const menuDriverItems = [
        {
            key: "profile",
            label: <Link to="/driver-detail">Thông tin cá nhân</Link>,
        },
        {
            key: "logout",
            label: <Link to="/user/login" onClick={handleLogoutUser}>Đăng xuất</Link>,
        },
        {
            key: "bookingList",
            label: <Link to="/driver-detail">Chuyến xe của bạn</Link>,
        }
    ];
    console.log(driver)
    return (
        <>

            <div className="shadow-[0_0_10px_10px_rgba(156,188,231,0.5)] bg-white ">


                <Row align="middle" justify="space-between" className="flex flex-wrap">
                    <Col className="gutter-row ml-30 flex space-x-4 items-center"  >
                        <Link to='/driver/booking'>
                            <img src={VTaxiLogo} alt="" width={100} height={50} className="rounded-2xl" />

                        </Link>
                        <div className="text-[rgb(95,160,245)] font-semibold p-6 text-lg flex space-x-6">
                            <Link to="/driver/booking"></Link>
                            <Link to="/driver-detail">Thông tin cá nhân</Link>
                        </div>
                        <div className="text-[rgb(95,160,245)] font-semibold p-6 text-lg flex space-x-6">
                            <Link to="/driver/statistic">Doanh thu</Link>
                        </div>
                    </Col> 


                    {isLoging ? (

                        <Col className="mr-30 flex justify-end items-center gap-3">
                            <Dropdown
                                menu={{ items: menuDriverItems }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <div className="cursor-pointer flex items-center space-x-2 text-blue-500">
                                    <UserOutlined className="text-2xl" />
                                    <p className="text-base font-medium">{driver.name}</p>
                                </div>
                            </Dropdown>
                        </Col>
                    ) : (
                        <Col >
                            <div className="flex space-x-4 items-center  mr-30">
                                <Link to='/user/login'><button className="bg-[rgb(95,160,245)] border border-[rgb(95,160,245)] 
                         rounded-3xl px-5 text-base  text-white py-2 font-semibold cursor-pointer" >
                                    Đăng nhập </button></Link>

                            </div>

                        </Col>

                    )}


                </Row>


            </div>
        </>
    )
}

export default DriverHeader;
