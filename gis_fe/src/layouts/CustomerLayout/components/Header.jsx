import React, { useEffect, useState } from "react";

import VTaxiLogo from "@assets/images/logo/VTaxi-100x100.ico";
import { Link, redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLS } from "@tools/localStorage.tool";
import { Col, Row, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AuthService from "@services/auth.service";
import { setIsLoging, setToken } from "@redux/slices/auth.slice";
import CustomerService from "@services/Customer.service";

const CustomerHeader = () => {
    const dispatch = useDispatch()
    const isLoging = useSelector((state) => state.auth.isLoging)
    const role = useSelector((state) => state.auth.role)
    const { refreshToken } = useSelector((state) => state.auth.tokens)

    const handleLogoutCustomer = async () => {
        dispatch(setToken({ accessToken: "", refreshToken: "" }));

    };
    const [customer, setCustomer] = useState({})

    const fetchCustomerInfo = async () => {
        const [response, error] = await CustomerService.info()
        if (error) {
            console.log('Không thể lấy thông tin khách hàng ', error)
            return
        }
        setCustomer(response.data)
    }
    useEffect(() => {
        fetchCustomerInfo()
    }, [])
    const menuItems = [
        {
            key: "profile",
            label: <Link to="/booking-list">Thông tin cá nhân</Link>,
        },
        {
            key: "logout",
            label: <Link to="/login" onClick={handleLogoutCustomer}>Đăng xuất</Link>,
        },
        {
            key: "bookingList",
            label: <Link to="/booking-list" >Chuyến xe của bạn</Link>,
        }
    ];

    return (
        <>

            <div className="shadow-[0_0_10px_10px_rgba(156,188,231,0.5)] bg-white ">

                <Row align="middle" justify="space-between" className="flex flex-wrap">
                    <Col className="gutter-row ml-30 flex space-x-4 items-center"  >
                        <Link to={'/'}>
                            <img src={VTaxiLogo} alt="" width={100} height={50} className="rounded-2xl" />

                        </Link>                            <div className="text-[rgb(95,160,245)] font-semibold p-6 text-lg flex space-x-6">
                            <Link to="/">Trang chủ</Link>
                            <Link to="/booking">Đặt xe</Link>
                            <Link to="/diver-partner">Đối tác tài xế</Link>
                        </div>


                    </Col>


                    {isLoging ? (
                        <>
                            <Col className="mr-30 flex justify-end items-center gap-3">
                                <Dropdown
                                    menu={{ items: menuItems }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <div className="cursor-pointer flex items-center space-x-2 text-blue-500">
                                        <UserOutlined className="text-2xl" />
                                        <p className="text-base font-medium">{customer.name}</p>
                                    </div>
                                </Dropdown>
                            </Col>

                        </>

                    ) : (
                        <Col >
                            <div className="flex space-x-4 items-center  mr-30">
                                <Link to='/login'><button className="bg-[rgb(95,160,245)] border border-[rgb(95,160,245)] 
                                             rounded-3xl px-5 text-base  text-white py-2 font-semibold cursor-pointer" >
                                    Đăng nhập </button></Link>
                                <Link to='/register'><button className="bg-white border border-[rgb(95,160,245)] rounded-3xl px-5 text-base 
                                            font-semibold text-[rgb(95,160,245)] py-2 cursor-pointer" >Đăng ký</button>
                                </Link>
                            </div>

                        </Col>

                    )}


                </Row>

            </div>
        </>
    )
}

export default CustomerHeader;

