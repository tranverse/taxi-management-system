import { Switch } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CiStar } from "react-icons/ci";
import { formatNumber } from "@utils/formatNumber";
import { BsCoin } from "react-icons/bs";
import useDrawRoute from "@hooks/useDrawRoute";
import { useLocation, useNavigate } from "react-router-dom";
import useInitialMap from "@hooks/useInitialMap";
import SubmitButton from "@components/Form/SubmitButton";
import CustomerService from "@services/Customer.service";
import mapboxgl from "mapbox-gl";
import DriverService from "@services/Driver.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useWebSocket from "@hooks/useWebsocket";
import { Alert, Flex, Spin } from 'antd';
import CustomMaker from "@components/Map/CustomMaker";
import { toast } from "react-toastify";
import BookingService from "@services/Booking.service";
import MapService from "@services/Map.service";
import { isRejected } from "@reduxjs/toolkit";
import { removeAllMarkers, removeRoute } from "@utils/removeMap";
import Breadcrumb from "@components/Breadcrumb";

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;
const AcceptBookking = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const drawRoute = useDrawRoute(mapRef)
    const [duration, setDuration] = useState('')
    const [customer, setCustomer] = useState({})
    const [isCheckAccumulate, setIsCheckAccumulate] = useState(false)
    const [initialPrice, setInitialPrice] = useState('')
    const [startLocationName, setStartLocationName] = useState('')
    const [endLocationName, setEndLocationName] = useState('')
    const [driver, setDriver] = useState({})
    const [booking, setBooking] = useState({})
    const [startLocation, setStartLocation] = useState({})
    const [endLocation, setEndLocation] = useState({})
    const [isBooking, setIsBooking] = useState(false)
    const [isCancel, setIsCancel] = useState(false)
    const navigate = useNavigate()

    useInitialMap({ mapRef, mapContainerRef })
    useEffect(() => {
        fetchDiverInfo()
    }, [])
    const { isConnected, messages } = useWebSocket(`/user/${driver.id}/ride-request`);
    // console.log(driver.latitude, driver.longitude)
    useEffect(() => {
        if (messages.length > 0) {
            console.log("🚖 Có đơn đặt xe mới:", messages[messages.length - 1]);
            setIsBooking(!isBooking)
            setBooking(messages[messages.length - 1]);
            toast.success("Có đơn đặt xe mới 🚗🚗🚗!")

        }
    }, [messages]);
    useEffect(() => {
        if (booking) {
            setStartLocation({ lng: booking.startingX, lat: booking.startingY })
            setEndLocation({ lng: booking.destinationX, lat: booking.destinationY })
            setInitialPrice(booking.price + booking.accumulatedDiscount + booking.memberDiscount)
        }
    }, [booking])
    const handleCancelBooking = async () => {
        const [response, error] = await BookingService.rejectedBooking(booking?.id)
        if (error) {
            console.log(error)
            return
        }
        toast.success("Hủy chuyến xe thành công")
        setIsBooking(false)
        removeRoute(mapRef, ["mainRoute", "driverRoute"]); // Xóa cả hai tuyến đường
        document.querySelectorAll(".mapboxgl-popup").forEach(popup => popup.remove());
        document.querySelectorAll(".mapboxgl-marker").forEach(marker => marker.remove());
    }

    const handleAcceptBooking = async () => {
        const data = {
            longitude: driver.longitude,
            latitude: driver.latitude,
            booking: booking
        }
        const [response, error] = await BookingService.updateStatus(data)

        if (error) {
            console.log('Phản hồi chấp nhận xe không thành công: ', error)
        }

        navigate("/driver/trip",
            {
                state: {
                    booking: booking,
                    driver: driver,
                    startLocationName: startLocationName,
                    endLocationName: endLocationName
                }
            }
        )


    }

    const getRoute = async () => {
        if (!startLocation || !endLocation) return;

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        const route = data.routes[0];

        setDuration((route.duration / 60).toFixed(0));

        drawRoute(route.geometry);

        // Lấy điểm giữa của tuyến đường
        const midPointIndex = Math.floor(route.geometry.coordinates.length / 2);
        const midPoint = route.geometry.coordinates[midPointIndex];

        // Hiển thị popup trên bản đồ
        new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
            .setLngLat(midPoint)
            .setHTML(`
                <p>
                    <i class="fa-solid fa-car"></i>
                   ${(route.distance / 1000).toFixed(2)} km<br>
                    <i class="fa-regular fa-clock"></i>
                   ${(route.duration / 60).toFixed(0)} phút
                </p>
            `)
            .addTo(mapRef.current);
    };

    const fetchDiverInfo = async () => {
        const [response, error] = await DriverService.getDriverInfo();
        if (error) {
            console.log('Lỗi khi lấy thông tin tài xế: ', error)
            return
        }
        // console.log(response)
        setDriver(response.data)
    }
    const fetchNameLocation = async (longitude, latitude, type) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        const response = await fetch(url)
        const data = await response.json()
        if (type == 'start') {
            setStartLocationName(data.features[0].place_name)
        } else {
            setEndLocationName(data.features[0].place_name)
        }

    }

    useEffect(() => {
        const fetchRoute = async () => {
            if (mapRef.current && startLocation.lng && endLocation.lng) {
                mapRef.current.fitBounds(
                    [
                        [startLocation.lng, startLocation.lat],
                        [endLocation.lng, endLocation.lat]
                    ],
                    {
                        padding: 50,
                        duration: 1000
                    }
                );
                fetchNameLocation(startLocation.lng, startLocation.lat, 'start')
                fetchNameLocation(endLocation.lng, endLocation.lat, 'end')
                if (startLocation && endLocation) {
                    const { route } = await MapService.getRoute(startLocation, endLocation, mapRef);
                    drawRoute(route.geometry, "blue", "mainRoute")
                }
                new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat(startLocation)
                    .setPopup(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }).setHTML("<p>Điểm đón</p>"))
                    .addTo(mapRef.current)
                    .togglePopup()

                new mapboxgl.Marker({ color: 'red' })
                    .setLngLat(endLocation)
                    .setPopup(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }).setHTML("<p>Điểm đến</p>"))
                    .addTo(mapRef.current)
                    .togglePopup()

            }
        }
        fetchRoute()

        if (driver.latitude && driver.longitude) {
            markerRef.current = []
            const marker = CustomMaker({
                map: mapRef.current,
                coordinates: { lat: driver.latitude, lng: driver.longitude },
                car: driver.car,
                description: 'Vị trí hiện tại của bạn',
                imageUrl: driver.car?.image,
                link: '',
                name: driver.car.description
            })
            markerRef.current.push(marker)
        }


    }, [startLocation, endLocation, driver])

    useEffect(() => {
        const fetchDriverRoute = async () => {

            if (driver && driver.longitude && driver.latitude && startLocation.lng && startLocation.lat) {
                const { route } = await MapService.getRoute(
                    { lat: driver.latitude, lng: driver.longitude },
                    startLocation,
                    mapRef
                );

                console.log("Driver Route:", route);

                if (route) {
                    drawRoute(route.geometry, "green", "driverRoute");
                } else {
                    console.error("Không có route nào trả về!");
                }
            }
        };

        fetchDriverRoute();
    }, [driver, startLocation]);
    return (
        <>
            <Breadcrumb
                routes={[
                ]} 
                role="DRIVER"
            />
            <div className="mb-40">

                <section className="grid grid-cols-1 lg:grid-cols-[1.8fr_2fr]  my-10 mx-30 h-[550px] ">
                    <div className="p-3 border mr-2 rounded-lg border-blue-400 ">
                        {isBooking ? (

                            <>

                                <p className="uppercase text-center font-semibold text-lg text-blue-600 ">Thông tin đặt xe</p>
                                <div className="grid grid-rows-1 ">
                                    <p className="my-2 text-base font-semibold">Thông tin khách hàng</p>

                                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-2">
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-[12px] text-gray-600">Họ tên</label>
                                            <input type="text" value={booking.customer?.name} readOnly
                                                className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                        </div>
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-[12px] text-gray-600">Số điện thoại</label>
                                            <input type="text" value={booking.customer?.phone} readOnly
                                                className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                        </div>


                                    </div>
                                    <p className="my-2 text-base font-semibold">Thông tin tài xế</p>
                                    <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_1.5fr_1fr] gap-4">
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-[12px] text-gray-600">Họ tên</label>
                                            <input type="text" value={driver.name} readOnly
                                                className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                        </div>
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-[12px] text-gray-600">Số điện thoại</label>
                                            <input type="text" value={driver.phone} readOnly
                                                className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                        </div>
                                        <div className="w-full flex flex-col">
                                            <label htmlFor="" className="text-[12px] text-gray-600">Đánh giá</label>
                                            <div className="flex items-center ">
                                                <p className="m-0">{(driver.star).toFixed(1)}/5 </p>
                                                <CiStar className=""></CiStar>
                                            </div>
                                            <hr className="border-t border-black mt-1" />

                                        </div>
                                    </div>
                                </div>

                                <p className="my-2 text-base font-semibold">Thông tin xe</p>
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-4">
                                    <div className="p-0 m-0 items-center">
                                        <img src={driver.car?.image} width={100} height={150} className="rounded" alt="" />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <label htmlFor="" className="text-[12px] text-gray-600">Loại xe</label>
                                        <input type="text" value={driver.vehicleType?.model} readOnly
                                            className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <label htmlFor="" className="text-[12px] text-gray-600">Số chỗ</label>
                                        <input type="text" value={driver.vehicleType?.seat} readOnly
                                            className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                    </div>
                                </div>
                                <p className="my-2 text-base font-semibold">Thông tin chuyến xe</p>
                                <div className="">
                                    <div className="w-full flex flex-col mb-2">
                                        <label htmlFor="" className="text-[12px] text-gray-600">Điểm đón</label>
                                        <input type="text" value={startLocationName} readOnly
                                            className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-0.5
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <label htmlFor="" className="text-[12px] text-gray-600">Điểm đến</label>
                                        <input type="text" value={endLocationName} readOnly
                                            className="w-full p-3 border-b focus:outline-none focus:border-blue-500 pt-1 pb-1
                        focus:border-b-2 transition-colors duration-300 pl-0 " />
                                    </div>
                                    <div className="leading-7">

                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <p className="font-bold">Khoảng cách: {booking.kilometer} km</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">Giá tiền: {formatNumber(initialPrice)} đ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold">Giảm thành viên:</p>
                                            <p className="font-bold">- {formatNumber((booking.memberDiscount))} đ</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center ">
                                                <BsCoin className="text-yellow-500 mr-2" />
                                                <p className="font-bold">Điểm tích lũy: </p>
                                            </div>
                                            <p className="font-bold"> -{formatNumber(booking.accumulatedDiscount)} đ</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold">Tổng tiền: </p>
                                        <p className="font-bold">{formatNumber(booking.price)} đ</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-between items-center">
                                    <button className=" bg-white text-red-500 w-full shadow-lg p-3 rounded font-semibold uppercase text-sm transition cursor-pointer
                        duration-200 ease-in-out hover:shadow-[0_0_10px_5px_rgba(156,188,231,0.5)] mr-3 
                        leading-normal border border-red-400" onClick={handleCancelBooking}>Từ chối</button>

                                    <button className=" bg-blue-400 text-white w-full shadow-lg p-3 rounded font-semibold uppercase text-sm transition cursor-pointer
                        duration-200 ease-in-out hover:bg-[#55acee] hover:shadow-[0_0_10px_5px_rgba(156,188,231,0.5)]
                        leading-normal" onClick={handleAcceptBooking}>Chấp nhận</button>
                                </div>
                            </>

                        ) : (
                            <div className="">
                                <Flex gap="middle" vertical>
                                    <Spin tip="" size="large">
                                    </Spin>
                                    <p className="text-blue-500 text-xl italic text-center">Chưa có chuyến xe</p>

                                </Flex>
                            </div>
                        )}


                    </div>

                    <div>

                        <div className="">
                            <div id='map-container-confirm' ref={mapContainerRef} />
                        </div>

                    </div>
                </section>
            </div>
        </>
    )
}

export default AcceptBookking