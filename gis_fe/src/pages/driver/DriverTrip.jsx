import useDrawRoute from '@hooks/useDrawRoute';
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import './.scss'
import useInitialMap from '@hooks/useInitialMap';
import SubmitButton from '@components/Form/SubmitButton';
import DriverService from '@services/Driver.service';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomMaker from '@components/Map/CustomMaker';
import { formatNumber } from '@utils/formatNumber';
import { BsCoin } from "react-icons/bs";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import MapService from '@services/Map.service';
import { toast } from 'react-toastify';
import BookingService from '@services/Booking.service';
import movingDriver from '@utils/movingDriver';
import Breadcrumb from '@components/Breadcrumb';

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;
const DriverTrip = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const { state } = useLocation()
    const { booking, startLocationName, endLocationName } = state || {}
    const [startLocation, setStartLocation] = useState({})
    const [endLocation, setEndLocation] = useState({})
    const [initialPrice, setInitialPrice] = useState('')
    const [isOpenInfoBox, setIsOpenInfoBox] = useState(false)
    const [driverMarker, setDriverMarker] = useState({})
    const [isTransporting, setIsTransporting] = useState(false)
    const [isArrived, setIsArrived] = useState(false)
    const [isFinshed, setIsFinished] = useState(false)
    const [status, setStatus] = useState({})
    const [driver, setDriver] = useState({})
    const navigate = useNavigate()
    const drawRoute = useDrawRoute(mapRef)

    useInitialMap({ mapRef, mapContainerRef })
    console.log(driver)

    const getStatus = async () => {
        const [response, error] = await BookingService.getStatus(booking.id)
        setStatus(response.data.status)
    }

    useEffect(() => {
        getStatus()
        if (booking) {
            setStartLocation({ lng: booking.startingX, lat: booking.startingY })
            setEndLocation({ lng: booking.destinationX, lat: booking.destinationY })
            setInitialPrice(booking.price + booking.accumulatedDiscount + booking.memberDiscount)
            fetchDriverInfo()
        }
    }, [booking])
    const fetchDriverInfo = async () => {
        const [response, error] = await DriverService.getDriverDetail(booking?.user?.id)
        if (error) {
            console.log("Lỗi khi lấy thông tin tài xế: ", error)
        }
        console.log(response)
        setDriver(response.data)
    }
    // console.log(status)
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

    const handleOpenInfobox = () => {
        setIsOpenInfoBox(!isOpenInfoBox)

    }
    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current.resize();
            }, 300); // Đợi animation hoàn tất rồi mới resize
        }
    }, [isOpenInfoBox]);
    const handleCancelBooking = () => {

    }

    useEffect(() => {
        const fetchDriverRoute = async () => {
            console.log("Driver:", driver);
            console.log("Start Location:", startLocation);

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
            } else {
                console.error("Thông tin tài xế hoặc điểm xuất phát chưa có!");
            }
        };

        fetchDriverRoute();
    }, [driver, startLocation]);

    useEffect(() => {
        console.log("Driver Location:", driver.latitude, driver.longitude);
        console.log("Start Location:", startLocation.lat, startLocation.lng);

    }, [driver, startLocation]);

    async function picking() {
        const { route } = await MapService.getRoute(
            { lng: driver.longitude, lat: driver.latitude },
            startLocation, mapRef
        );

        await movingDriver(driver.id, driverMarker, route.geometry.coordinates, mapRef.current)
        setIsArrived(true);

    }


    useEffect(() => {
        if (driverMarker && driverMarker.setLngLat && driver.latitude && driver.longitude) {
            picking();
        }
    }, [driverMarker, driver]);

    // nhận khách
    const handleStartingTransport = () => {
    }

    const handleTransporting = async () => {
        if (!isTransporting) {
            setIsTransporting(true); // Bật trạng thái vận chuyển
        }

        if (isArrived) {
            const data = {
                booking: booking,
                latitude: driver.latitude,
                longitude: driver.longitude,
            };

            const [response, error] = await BookingService.updateStatus(data);
            if (error) {
                console.error("Update status failed:", error);
                return;
            }

            // Lấy tuyến đường từ điểm đón đến điểm đến
            const { route } = await MapService.getRoute(startLocation, endLocation, mapRef);

            const maxUpdates = 5; // Giới hạn số lần gửi
            const fullRoute = route.geometry.coordinates;
            const routeLength = fullRoute.length;
            let limitedRoute = [];

            // Nếu route có ít hơn hoặc bằng maxUpdates, gửi toàn bộ
            if (routeLength <= maxUpdates) {
                limitedRoute = fullRoute;
            } else {
                limitedRoute = [fullRoute[0]]; // Bắt đầu bằng điểm đầu

                // Lấy các điểm ở giữa cách đều nhau
                const step = Math.floor(routeLength / (maxUpdates - 1));
                for (let i = step; i < routeLength - 1; i += step) {
                    limitedRoute.push(fullRoute[i]);
                }

                limitedRoute.push(fullRoute[routeLength - 1]); // Kết thúc bằng điểm cuối
            }

            // Gửi dữ liệu
            for (const element of limitedRoute) {
                const dataTrace = {
                    booking: booking,
                    latitude: element[1],
                    longitude: element[0],
                    status: "TRANSPORTING",
                };

                const [traceResponse, traceError] = await BookingService.traceDriver(dataTrace);
                const [driverLocationResponse, error] = await DriverService.updateLocation()
                if (traceError) {
                    console.error("Trace update failed:", traceError);
                    return;
                }
            }

            // 🚗 Di chuyển tài xế đến điểm đến
            await movingDriver(driver.id, driverMarker, fullRoute, mapRef.current);

            // Cập nhật trạng thái hoàn thành
            setIsFinished(true);
        }
    };

    const handleFinished = async () => {
        const data = {
            booking: booking,
            latitude: driver.latitude,
            longitude: driver.longitude,
        };
        const [response, error] = await BookingService.updateStatus(data);
        console.log(response)
        if (error) {
            console.log("Lỗi không hoàn thành chuyến xe")
            return
        }
        toast.success("Đã hoàn thành chuyến xe")
        navigate("/driver/booking")
    }
    useEffect(() => {

        if (isTransporting) {
            handleTransporting()
        }
        if (isFinshed) {
            handleFinished()
        }
    }, [isArrived, driver])

    return (
        <>
            <Breadcrumb
                routes={[
                    { path: "/driver/booking", name: "Lộ trình chuyến xe", icon: "route" },
                ]}
                role="DRIVER"
            />

            <div className='mx-30 my-10 mb-20'>

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
                        // Nếu tài xế chưa đến nơi, disable nút "Nhận khách"
                        <SubmitButton disabled={true} className="bg-gray-300 text-white">
                            Nhận khách
                        </SubmitButton>
                    ) : !isTransporting ? (
                        // Nếu đã đến nơi nhưng chưa nhận khách, hiển thị nút "Nhận khách"
                        <SubmitButton onClick={handleTransporting} className="bg-blue-400 text-white cursor-pointer">
                            Nhận khách
                        </SubmitButton>
                    ) : !isFinshed ? (
                        // Nếu đang chở khách nhưng chưa hoàn thành chuyến, disable nút "Hoàn thành"
                        <SubmitButton disabled={true} className="bg-gray-300 text-white">
                            Đang di chuyển
                        </SubmitButton>
                    ) : (
                        // Khi chuyến xe đã hoàn thành, cho phép bấm "Hoàn thành"
                        <SubmitButton onClick={handleFinished} className="bg-blue-400 text-white cursor-pointer">
                            Hoàn thành
                        </SubmitButton>
                    )}

                </div>



            </div >
        </>

    )
}

export default DriverTrip