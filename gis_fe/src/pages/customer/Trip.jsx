import useDrawRoute from '@hooks/useDrawRoute'
import useWebSocket from '@hooks/useWebsocket'
import BookingService from '@services/Booking.service'
import React, { use, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoIosArrowDropleftCircle } from "react-icons/io";
import SubmitButton from '@components/Form/SubmitButton'
import mapboxgl from 'mapbox-gl'
import './.scss'
import { BsCoin } from "react-icons/bs";
import { CiStar } from 'react-icons/ci'
import { formatNumber } from '@utils/formatNumber'
import useInitialMap from '@hooks/useInitialMap'
import CustomMaker from '@components/Map/CustomMaker'
import MapService from '@services/Map.service'
import movingDriver from '@utils/movingDriver'
import Review from '@components/Review'
import { toast } from 'react-toastify'
import Breadcrumb from '@components/Breadcrumb'
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;

const Trip = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const drawRoute = useDrawRoute(mapRef)
    const { state } = useLocation()
    const { driver, booking, startLocationName, endLocationName, startLocation, endLocation } = state || ''
    const [status, setStatus] = useState([])
    const [isOpenInfoBox, setIsOpenInfoBox] = useState(false)
    const [initialPrice, setInitialPrice] = useState('')
    const [driverMarker, setDriverMarker] = useState({})
    const [isTransporting, setIsTransporting] = useState(false)
    const [isArrived, setIsArrived] = useState(false)
    const [isFinshed, setIsFinished] = useState(false)
    const [showReviewPopup, setShowReviewPopup] = useState(true);
    const navigate = useNavigate()
    useInitialMap({ mapRef, mapContainerRef })

    const { isConnected: pickingIsConnected, messages: pickingMessages } = useWebSocket(`/user/${driver?.id}/confirm-picking`)
    const { isConnected: transportingConnected, messages: transportingMessages } = useWebSocket(`/user/${driver?.id}/confirm-transporting`)
    const { isConnected: reviewConnected, messages: reviewMessage } = useWebSocket(`/user/${driver?.id}/review-status`)


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
            const driverMarker = CustomMaker({
                map: mapRef.current,
                coordinates: { lat: driver.latitude, lng: driver.longitude },
                car: driver.car,
                description: 'Vị trí hiện tại của bạn',
                imageUrl: driver.car?.image,
                link: '',
                name: driver.car.description
            })
            markerRef.current.push(driverMarker)
            setDriverMarker(driverMarker)
        }

    }, [startLocation, endLocation, driver])
    console.log(markerRef.current, driver)

    useEffect(() => {
        console.log(pickingMessages, transportingMessages, driverMarker, driver)
        const driverPicking = async () => {
            if (!isArrived && driverMarker && driverMarker.setLngLat && driver.latitude && driver.longitude) {
                console.log("Tài xế đang đến đón bạn")
                const { route } = await MapService.getRoute(
                    { lng: driver.longitude, lat: driver.latitude },
                    startLocation, mapRef
                );
                await movingDriver(driver.id, driverMarker, route.geometry.coordinates, mapRef.current)
            }
        }


        driverPicking()


    }, [pickingMessages, driverMarker, driver])

    useEffect(() => {
        const driverTransporting = async () => {

            if (transportingMessages.length > 0 ) {
                console.log("Đang thực hiện chuyến xe")
                setIsArrived(true)
                setIsTransporting(true)
                const { route } = await MapService.getRoute(startLocation, endLocation, mapRef);
                await movingDriver(driver.id, driverMarker, route.geometry.coordinates, mapRef.current);

            }
        }
        driverTransporting()

    }, [ transportingMessages, driverMarker, driver])

    useEffect(() => {
        if (reviewMessage.length > 0) {
            setIsFinished(true);
            toast.success("Hoàn thành chuyến xe");
            setShowReviewPopup(true);
        }

    }, [reviewMessage])

    const handleOpenInfobox = () => {
        setIsOpenInfoBox(!isOpenInfoBox)

    }

    useEffect(() => {
        const fetchDriverRoute = async () => {
            if (driver && driver.longitude && driver.latitude && startLocation.lng && startLocation.lat) {
                const { route } = await MapService.getRoute(
                    { lat: driver?.latitude, lng: driver?.longitude },
                    startLocation,
                    mapRef
                );
                console.log(route)
                drawRoute(route.geometry, "green", "driverRoute")
            }
        };

        fetchDriverRoute();
    }, [driver, startLocation]);


    return (
        <>
            <Breadcrumb
                routes={[
                    { path: "/booking", name: "Đặt xe ", icon: "profile" },
                    { path: "/confirm-booking", name: "Xác nhận chuyến xe ", icon: "confirm" },
                    { path: "/driver/trip", name: "Lộ trình ", icon: "route" },

                ]}
            />

            <div className='mx-30 my-10'>
                <div className={`grid grid-cols-1 lg:grid-cols-[1.8fr_2fr]`}>

                    {isOpenInfoBox ? (
                        <>

                            <div className="p-3 border mr-2 rounded-lg border-blue-400 ">

                                <div className="relative">
                                    <div className="absolute right-2 text-3xl" onClick={handleOpenInfobox}>
                                        <IoIosArrowDropleftCircle className="right-0 text-blue-400" />
                                    </div>
                                </div>
                                <p className="uppercase text-center font-semibold text-lg text-blue-600 ">Thông tin đặt xe</p>
                                <div className="grid grid-rows-1 ">
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
                                                <p className="m-0">{(driver.star).toFixed(1)}/5</p>
                                                <CiStar className=""></CiStar>
                                            </div>
                                            <hr className="border-t border-black mt-1" />

                                        </div>
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
                                                <p className="font-bold">Khoảng cách: {booking?.booking?.kilometer} km</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">Giá tiền: {formatNumber(booking?.booking?.price + booking?.booking.accumulatedDiscount + booking?.booking?.memberDiscount)} đ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold">Giảm thành viên:</p>
                                            <p className="font-bold">- {formatNumber((booking?.booking?.memberDiscount) )} đ</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center ">
                                                <BsCoin className="text-yellow-500 mr-2" />
                                                <p className="font-bold">Điểm tích lũy: </p>
                                            </div>
                                            <p className="font-bold"> -{formatNumber(booking?.booking?.accumulatedDiscount)} đ</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold">Tổng tiền: </p>
                                        <p className="font-bold">{formatNumber(booking?.booking?.price)} đ</p>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : (

                        <div className="p-3 border mr-2 rounded-lg border-blue-400 w-10 ">

                            <div className="flex justify-center">
                                <div className=" text-3xl " onClick={handleOpenInfobox}>
                                    <IoIosArrowDropleftCircle className=" text-blue-400" />
                                </div>
                            </div>
                        </div>

                    )}



                    <div className="border border-blue-400 rounded">
                        <div id='map-container' style={{ width: isOpenInfoBox ? '100%' : '1230px' }} ref={mapContainerRef} />
                    </div>

                </div>

                <div className='mt-3'>
                    {!isArrived ? (
                        <SubmitButton disabled={true} className=" flex justify-center bg-white
                                text-orange-400 border border-orange-400 hover:bg-transparent cursor-alias ">
                            Tài xế đang đến đón bạn
                            <div className='ml-3 flex space-x-2 justify-center items-center  dark:invert'>
                                <div className='h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                <div className='h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                <div className='h-2 w-2 bg-orange-400 rounded-full animate-bounce'></div>
                            </div>
                        </SubmitButton>
                    ) : (
                        <SubmitButton disabled={true} className=" flex justify-center bg-blue-400
                                text-white  ">
                            Đang thực hiện chuyến xe
                            <div className='ml-3 flex space-x-2 justify-center items-center  dark:invert'>
                                <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                <div className='h-2 w-2 bg-white rounded-full animate-bounce'></div>
                            </div>
                        </SubmitButton>
                    )}

                </div>


                {isFinshed && showReviewPopup && (
                    <Review booking={booking.booking} onClose={() => {
                        setShowReviewPopup(false);
                        navigate("/booking");
                    }} />
                )}

            </div >

        </>
    )
}

export default Trip