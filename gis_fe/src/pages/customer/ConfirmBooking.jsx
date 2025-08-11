import React, { useEffect, useRef, useState } from "react";
import { Form } from "@components/Form";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import useInitialMap from "@hooks/useInitialMap";
import './.scss';
import { useLocation, useNavigate } from "react-router-dom";
import useDrawRoute from "@hooks/useDrawRoute";
import CustomerService from "@services/Customer.service";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TEInput } from 'tw-elements-react'
import { CiStar } from "react-icons/ci";
import { formatNumber } from "@utils/formatNumber";
import { BsCoin } from "react-icons/bs";
import Switch from '@mui/material/Switch';
import SubmitButton from "@components/Form/SubmitButton";
import BookingService from "@services/Booking.service";
import { toast } from "react-toastify";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import useWebSocket from "@hooks/useWebsocket";
import './.scss'
import MapService from "@services/Map.service";
import ReadOnlyInput from "@components/ReadOnlyInput";
import CustomMaker from "@components/Map/CustomMaker";
import Breadcrumb from "@components/Breadcrumb";
import DriverRejectedPopup from "@components/DriverRejectedPopup";
import { haversineDistance } from "@tools/distance.tool";

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;
const ConfirmBooking = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const drawRoute = useDrawRoute(mapRef)
    const [kilometer, setKilometer] = useState('')
    const [duration, setDuration] = useState('')
    const { state } = useLocation();
    const { startLocation, endLocation, driver, priceByVehicleType, price, users } = state || {};
    const [customer, setCustomer] = useState({})
    const [isCheckAccumulate, setIsCheckAccumulate] = useState(false)
    const [totalPrice, setTotalPrice] = useState(price);
    const [startLocationName, setStartLocationName] = useState('')
    const [endLocationName, setEndLocationName] = useState('')
    const [driverMarker, setDriverMarker] = useState({})
    const [accumulate, setAccumulate] = useState(0)
    const [data, setData] = useState({})
    const [isAccepted, setIsAccepted] = useState(false)
    const [isBooked, setIsBooked] = useState(false)
    const [isShowRejectedPopup, setIsShowRejectedPopup] = useState(false)
    const [intitialPrice, setInitialPrice] = useState(price)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [systemMessages, setSystemMessages] = useState('Hệ thống đang tìm tài xế khác, vui lòng đợi trong giây lát...')
    const [bookingData, setBookingData] = useState({
        kilometer: '',
        startingX: '',
        startingY: '',
        destinationX: '',
        destinationY: '',
        accumulatedDiscount: '',
        memberDiscount: '',
        price: '',
        customer: {},
        user: {}
    })
    const navigate = useNavigate()

    const getMessage = useMessageByApiCode()
    useInitialMap({ mapRef, mapContainerRef })


    const fetchCustomerInfo = async () => {
        const [response, error] = await CustomerService.info()
        if (error) {
            console.log('Không thể lấy thông tin khách hàng ', error)
            return
        }
        setCustomer(response.data)
    }
    const handleCheckAccumulate = () => {
        setIsCheckAccumulate((prev) => {
            const newCheckAccumulate = !prev;
            setTotalPrice((prevPrice) =>
                newCheckAccumulate
                    ? prevPrice - (customer.accumulate || 0)
                    : prevPrice + (customer.accumulate || 0)
            );
            return newCheckAccumulate;
        });

        setAccumulate((prev) =>
            isCheckAccumulate ?  0 :customer.accumulate
        );
    };

    const fetchNameLocation = async (longitude, latitude, type) => {
        const response = await MapService.fetchNameLocation(longitude, latitude)
        if (type == 'start') {
            setStartLocationName(response)
        } else {
            setEndLocationName(response)
        }

    }
    const handleBooking = async () => {
        console.log(accumulate)
        const newBookingData = {
            kilometer: kilometer,
            startingX: startLocation?.lng,
            startingY: startLocation?.lat,
            destinationX: endLocation?.lng,
            destinationY: endLocation?.lat,
            accumulatedDiscount: accumulate,
            memberDiscount: price * (customer?.type?.reducedRate || 0),
            price: totalPrice,
            customer: customer,
            user: driver,
            driverX: driver.longitude,
            driverY: driver.latitude
        };

        // setBookingData(newBookingData);
        const [response, error] = await BookingService.bookCar(newBookingData);

        if (error) {
            console.log(error)
            toast.error(getMessage(error.code));
            return;
        }
        toast.success("Đặt xe thành công");
        setIsBooked(true)
    };

    useEffect(() => {
        fetchCustomerInfo()
    }, [])
    useEffect(() => {
        if (customer?.id) {
            setTotalPrice(price - (price * (customer?.type?.reducedRate || 0)));
        }
    }, [customer.id, customer?.type?.reducedRate]); // Cập nhật khi giảm giá thay đổi

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
                    const { route, kilometer } = await MapService.getRoute(startLocation, endLocation, mapRef);
                    drawRoute(route.geometry, "blue", "mainRoute")
                    setKilometer(kilometer)
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
    useEffect(() => {
        const fetchDriverRoute = async () => {
            if (driver && driver.longitude && driver.latitude && startLocation.lng && startLocation.lat) {
                const { route } = await MapService.getRoute(
                    { lat: driver.latitude, lng: driver.longitude },
                    startLocation,
                    mapRef
                );
                drawRoute(route.geometry, "green", "driverRoute")
            }
        };

        fetchDriverRoute();
    }, [driver, startLocation]);
    const { isConnected, messages } = useWebSocket(`/user/${driver.id}/confirm-picking`)
    useEffect(() => {
        if (messages.length > 0) {
            console.log('Yêu cầu xác nhận từ tài xế')
            const data = messages[messages.length - 1]
            console.log(data)
            console.log(bookingData)
            if (data.bookingStatus == "PICKING") {
                navigate("/trip", {
                    state: { driver: driver, booking: data, startLocationName, endLocationName, startLocation, endLocation }
                })
            } else {
                toast.error("Tài xế không chấp nhận yêu cầu đặt xe của bạn (liu liu)🤪🤪.")
                navigate("/booking")

            }
        }

    }, [messages])
    // Tài xế từ chối
    // console.log(accumulate, isCheckAccumulate)

    // console.log(users)
    // const handleFindAnotherDriver = () => {
    //     const availableDrivers = users.filter(user =>
    //         user.id !== driver?.id &&
    //         user?.vehicleType?.id === driver?.vehicleType?.id
    //     );


    //     const sortedDrivers = availableDrivers
    //         .map(d => ({
    //             ...d,
    //             distance: haversineDistance(
    //                 { lng: startLocation?.startingX, lat: startLocation?.startingY },
    //                 { lng: d.longitude, lat: d.latitude }
    //             )
    //         }))
    //         .sort((a, b) => a.distance - b.distance);

    //     const newDriver = sortedDrivers.length > 0 ? sortedDrivers[0] : null;
    //     console.log(accumulate, isCheckAccumulate)

    //     if (newDriver) {
    //         setBookingData(prev => {
    //             const updatedBooking = {
    //                 ...prev, 
    //                 kilometer,
    //                 startingX: startLocation?.lng,
    //                 startingY: startLocation?.lat,
    //                 destinationX: endLocation?.lng,
    //                 destinationY: endLocation?.lat,
    //                 accumulatedDiscount: accumulate,
    //                 memberDiscount: price * (customer?.type?.reducedRate || 0),
    //                 price: totalPrice,
    //                 customer,
    //                 user: newDriver
    //             };
    //             console.log("🚀 Booking Data Updated:", updatedBooking);
    //             return updatedBooking;
    //         });
            
    //     }

    //     return newDriver; // ✅ Chỉ lấy tài xế gần nhất
    // };
    const handleFindAnotherDriver = () => {
        let availableDrivers = users.filter(user =>
            user.id !== driver?.id &&
            user?.vehicleType?.id === driver?.vehicleType?.id
        );
        const filteredUsersList = users.filter(user => user.id !== driver?.id);


        // Nếu không có tài xế nào cùng loại xe, kiểm tra số ghế
        if (availableDrivers.length === 0) {
            availableDrivers = users.filter(user =>
                user.id !== driver?.id &&
                user?.vehicleType?.seat === driver?.vehicleType?.seat
            );
        }
    
        const sortedDrivers = availableDrivers
            .map(d => ({
                ...d,
                distance: haversineDistance(
                    { lng: startLocation?.startingX, lat: startLocation?.startingY },
                    { lng: d.longitude, lat: d.latitude }
                )
            }))
            .sort((a, b) => a.distance - b.distance);
    
        const newDriver = sortedDrivers.length > 0 ? sortedDrivers[0] : null;

        if (newDriver) {
            setBookingData(prev => {
                const updatedBooking = {
                    ...prev,
                    kilometer,
                    startingX: startLocation?.lng,
                    startingY: startLocation?.lat,
                    destinationX: endLocation?.lng,
                    destinationY: endLocation?.lat,
                    accumulatedDiscount: accumulate,
                    memberDiscount: price * (customer?.type?.reducedRate || 0),
                    price: totalPrice,
                    customer,
                    user: newDriver
                };
                return updatedBooking;
            });
        }
    
        return { newDriver: sortedDrivers.length > 0 ? sortedDrivers[0] : null, filteredUsersList };
    };

    useEffect(() => {
        const { filteredUsersList } = handleFindAnotherDriver();
        setFilteredUsers(filteredUsersList); 
    }, [users]); 


    const { isConnected: isRejectConnected, messages: rejectedMessages } = useWebSocket(`/user/${customer?.id}/rejected-booking`)
    console.log( filteredUsers)

    useEffect(() => {
        if (rejectedMessages?.length > 0) {
            console.log('Yêu cầu hủy chuyến từ tài xế');
            setIsShowRejectedPopup(true);

            const bookNewDriver = async () => {
                const {newDriver} = handleFindAnotherDriver();

                // Kiểm tra nếu không có tài xế mới
                if (!newDriver) {
                    console.log("Không tìm thấy tài xế thay thế.");

                    // Hiển thị thông báo lỗi lên giao diện
                    // toast.error("Hệ thống không tìm thấy chuyến xe, vui lòng chọn chuyến khác.")
                    setSystemMessages("Hệ thống không tìm thấy tài xế, vui lòng đặt lại chuyến khác.")
                    console.log(startLocation, endLocation)
                    setTimeout(() => {
                        navigate("/booking", {
                            
                        });
                    }, 5000);

                    return;
                }
                let newPrice = totalPrice
                if(newDriver?.vehicleType?.id != driver?.vehicleType?.id){
                    const [response, error] = await BookingService.calculatePrice(kilometer, newDriver?.vehicleType)
                    setInitialPrice(response.data?.price)
                    if(isCheckAccumulate){
                        setTotalPrice(response.data?.price - customer?.accumulate - price * (customer?.type?.reducedRate || 0))
                        newPrice = response.data?.price - customer?.accumulate - price * (customer?.type?.reducedRate || 0)

                    }else{
                        setTotalPrice(response.data?.price - price * (customer?.type?.reducedRate || 0))
                        newPrice = response.data?.price - price * (customer?.type?.reducedRate || 0)

                    }
        
                }
                console.log(newPrice, totalPrice)
                setFilteredUsers(filteredUsers)
                const newBookingData = {
                    kilometer: kilometer,
                    startingX: startLocation?.lng,
                    startingY: startLocation?.lat,
                    destinationX: endLocation?.lng,
                    destinationY: endLocation?.lat,
                    accumulatedDiscount: accumulate,
                    memberDiscount: price * (customer?.type?.reducedRate || 0),
                    price: newPrice,
                    customer: customer,
                    user: newDriver,
                    driverX: newDriver.longitude,
                    driverY: newDriver.latitude
                };
                const [response, error] = await BookingService.bookCar(newBookingData);
                if (error) {
                    console.log("Lỗi thay đổi tài xế không thành công: ", error);
                    return;
                }
                console.log(filteredUsers)
                navigate("/confirm-booking", {
                    state: { ...location.state, price: newPrice, driver: newDriver, startLocation, endLocation, users: filteredUsers }
                });
                document.querySelectorAll(".mapboxgl-popup").forEach(popup => popup.remove());
                document.querySelectorAll(".mapboxgl-marker").forEach(marker => marker.remove());
                const timeout = setTimeout(() => {
                    setIsShowRejectedPopup(false);
                }, 5000);
            };

            bookNewDriver();
        }
    }, [rejectedMessages]);

    return (
        <>
            <Breadcrumb
                routes={[
                    { path: "/booking", name: "Đặt xe ", icon: "profile" },
                    { path: "/confirm-booking", name: "Xác nhận chuyến xe ", icon: "confirm" },

                ]}
            />

            <div className="mb-40">

                <section className="grid grid-cols-1 lg:grid-cols-[1.8fr_2fr]  my-10 mx-30 h-[550px] ">
                    <div className="p-3 border mr-2 rounded-lg border-blue-400">
                        <p className="uppercase text-center font-semibold text-lg text-blue-600 ">Thông tin đặt xe</p>
                        <div className="grid grid-rows-1 ">
                            <p className="my-2 text-base font-semibold">Thông tin khách hàng</p>

                            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-2">
                                <ReadOnlyInput value={customer.name} label="Họ tên"></ReadOnlyInput>
                                <ReadOnlyInput value={customer.phone} label="Số điện thoại"></ReadOnlyInput>
                            </div>
                            <p className="my-2 text-base font-semibold">Thông tin tài xế</p>
                            <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_1.5fr_1fr] gap-4">
                                <ReadOnlyInput value={driver.name} label="Họ tên"></ReadOnlyInput>

                                <ReadOnlyInput value={driver.phone} label="Số điện thoại"></ReadOnlyInput>

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

                        <p className="my-2 text-base font-semibold">Thông tin xe</p>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-4">
                            <div className="p-0 m-0 items-center">
                                <img src={driver.car.image} width={100} height={150} className="rounded" alt="" />
                            </div>
                            <ReadOnlyInput value={driver.vehicleType?.model} label="Loại xe"></ReadOnlyInput>
                            <ReadOnlyInput value={driver.vehicleType?.seat} label="Loại xe"></ReadOnlyInput>
                        </div>
                        <p className="my-2 text-base font-semibold">Thông tin chuyến xe</p>
                        <div className="">

                            <ReadOnlyInput value={startLocationName} label="Điểm đón"></ReadOnlyInput>
                            <ReadOnlyInput value={endLocationName} label="Điểm đến"></ReadOnlyInput>

                            <div className="leading-7">

                                <div className="flex items-center justify-between mt-3">
                                    <div>
                                        <p className="font-bold">Khoảng cách: {kilometer} km</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Giá tiền: {formatNumber(intitialPrice)} đ</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-bold">Giảm thành viên: {(customer.type?.reducedRate) * 100}%</p>
                                    <p className="font-bold">- {formatNumber((price * (customer.type?.reducedRate)))} đ</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center ">
                                        <BsCoin className="text-yellow-500 mr-2" />
                                        <p className="font-bold">Dùng {formatNumber(customer.accumulate)} điểm tích lũy</p>
                                        <div className="ml-1">
                                            <Switch onClick={handleCheckAccumulate} />
                                        </div>
                                    </div>
                                    {isCheckAccumulate ? (
                                        <p className="font-bold"> - {formatNumber((customer.accumulate))} đ</p>

                                    ) : (
                                        <p className="font-bold">- 0 đ</p>
                                    )}
                                </div>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between">
                                <p className="font-bold">Tổng tiền: </p>
                                <p className="font-bold">{formatNumber(totalPrice)} đ</p>
                            </div>
                        </div>
                        <div className="mt-5">
                            {!isBooked ? (
                                <button type="submit" onClick={handleBooking}
                                    className={`w-full shadow-lg text-white p-3 rounded font-semibold uppercase text-sm transition cursor-pointer
                            duration-200 ease-in-out hover:bg-[#55acee] hover:shadow-[0_0_10px_5px_rgba(156,188,231,0.5)]
                            leading-normal bg-blue-400`}>Đặt xe</button>
                            ) : (

                                <SubmitButton disabled={true} className=" flex justify-center bg-white
                                text-orange-400 border border-orange-400 hover:bg-transparent cursor-none ">
                                    Đang chờ tài xế chấp nhận
                                    <div className='ml-3 flex space-x-2 justify-center items-center  dark:invert'>
                                        <div class='h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                        <div className='h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                        <div className='h-2 w-2 bg-orange-400 rounded-full animate-bounce'></div>
                                    </div>
                                </SubmitButton>

                            )}


                        </div>

                    </div>

                    <div>

                        <div className="">
                            <div id='map-container-confirm' ref={mapContainerRef} />
                        </div>

                    </div>
                </section>
            </div>
            {isShowRejectedPopup && (
                <DriverRejectedPopup
                    isOpen={isShowRejectedPopup}
                    onClose={() => setIsShowRejectedPopup(false)}
                    messages={systemMessages}
                />
            )}

        </>
    )
}

export default ConfirmBooking