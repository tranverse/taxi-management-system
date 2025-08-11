import React, { useEffect, useRef, useState } from "react";
import { Form, Field, SelectOption } from "@components/Form";
import './.scss';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SubmitButton from "@components/Form/SubmitButton";
import SearchIcon from '@mui/icons-material/Search';
import { HiSwitchHorizontal } from "react-icons/hi";
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import DiverFree from "@components/DiverFree";
import { toast, Zoom } from "react-toastify";
import DiverService from "@services/Driver.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import DriverService from "@services/Driver.service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingService from "@services/Booking.service";
import useInitialMap from "@hooks/useInitialMap";
import { useSelector } from "react-redux";
import useDrawRoute from "@hooks/useDrawRoute";
import CustomMaker from "@components/Map/CustomMaker";
import { haversineDistance } from "@tools/distance.tool";
import MapService from "@services/Map.service";
import Breadcrumb from "@components/Breadcrumb";
import VehicleTypeService from "@services/VehicleType.service";
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;
const Booking = () => {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const popupRef = { current: null }; // Lưu popup
    const radius = 5
    const location = useLocation();
    const [suggestions, setSuggestions] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [selectedLocation, setSelectedLocation] = useState({});
    const [startLocation, setStartLocation] = useState({})
    const [endLocation, setEndLocation] = useState({})
    const [freeDrivers, setFreeDrivers] = useState([])
    const [freeDriversInDistance, setFreeDriversInDistance] = useState([])
    const [allFreeDriversInDistance, setAllFreeDriversInDistance] = useState([])
    const [kilometer, setKilometer] = useState('')
    const [duration, setDuration] = useState('')
    const [priceByVehicleType, setPriceByVehicleType] = useState([])
    const isLoging = useSelector((state) => state.auth.isLoging)
    const [start, setStart] = useState('')
    const [error, setError] = useState('')
    const [vehicleType, setVehicleType] = useState([])
    const [vehicleTypeSelected, setVehicleTypeSelected] = useState('all')
    const [currentLocation, setCurrentLocation] = useState(null);

    const [freeDriversByVehicle, setFreeDriversByVehicle] = useState([])
    const navigate = useNavigate()
    const getMessage = useMessageByApiCode()

    useInitialMap({ mapRef, mapContainerRef, startLocation, endLocation })
    const drawRoute = useDrawRoute(mapRef)
    // useEffect(() => {
    //     if (location.state) {
    //         setStartLocation(location.state.startLocation || {});
    //         setEndLocation(location.state.endLocation || {});
    //         setFreeDriversInDistance(location.state.freeDriversInDistance);
    //         setFreeDrivers(location.state.freeDriversInDistance)
    //         setKilometer(location.state.kilometer || "");
    //     }
    // }, [location.state]);
    // console.log(location?.state?.freeDriversInDistance);

    // useEffect(() => {
    //     const fetchAllSuggestions = async () => {
    //         let combinedSuggestions = suggestions; // Lưu danh sách cũ
    //         console.log(suggestions)
    //         if (startLocation.label) {
    //             const startSuggestions = await fetchSuggestions(startLocation.label);
    //             combinedSuggestions = [...combinedSuggestions, ...startSuggestions];
    //         }

    //         if (endLocation.label) {
    //             const endSuggestions = await fetchSuggestions(endLocation.label);
    //             combinedSuggestions = [...combinedSuggestions, ...endSuggestions];
    //         }

    //         // Loại bỏ trùng lặp bằng Map
    //         const uniqueSuggestions = [...new Map(combinedSuggestions.map(item => [item.value, item])).values()];

    //         setSuggestions(uniqueSuggestions);
    //     };

    //     if (startLocation.label || endLocation.label) {
    //         fetchAllSuggestions();
    //     }
    // }, [startLocation, endLocation]);

    // console.log(suggestions)

    useEffect(() => {
        if (vehicleTypeSelected != 'all') {
            handleVehicleTypeChange(vehicleTypeSelected)
        } else {
            if (!location?.state?.freeDriversInDistance) {
                fetchFreeDrivers()

            }
        }

    }, [vehicleTypeSelected])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = {
                        value: `${longitude},${latitude}`,
                        label: "📍 Vị trí hiện tại",
                    };

                    setCurrentLocation(location);
                },
                () => {
                    console.error("Không lấy được vị trí hiện tại.");
                }
            );
        }
    }, []);

    // Cập nhật suggestions khi currentLocation thay đổi
    useEffect(() => {
        if (currentLocation) {
            setSuggestions([currentLocation]); // Thêm vị trí hiện tại vào danh sách
        }
    }, [currentLocation]);

    useEffect(() => {
        if (searchText) {
            fetchSuggestions(searchText);
        }
    }, [searchText]);
    const fetchSuggestions = async (searchText = "") => {
        if (!searchText) {
            setSuggestions(currentLocation ? [currentLocation] : []);
            return;
        }

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchText
        )}.json?access_token=${mapboxgl.accessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const mapboxOptions = data.features.map((place) => ({
                value: place.center.join(","),
                label: place.place_name,
            }));

            setSuggestions(currentLocation ? [currentLocation, ...mapboxOptions] : mapboxOptions);
            // console.log("Dữ liệu API Mapbox:", mapboxOptions);
            // return currentLocation ? [currentLocation, ...mapboxOptions] : mapboxOptions;

        } catch (error) {
            console.error("Lỗi khi gọi API Mapbox:", error);
        }
    };



    const handleSelectedLocation = (selectedOption, type) => {
        const [lng, lat] = selectedOption.value.split(",").map(Number)

        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14
        })

        if (type == 'start') {
            new mapboxgl.Marker({ color: 'blue' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current)
        } else {
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat([lng, lat])
                .addTo(mapRef.current)
        }



        // if (type === "start") {
        //     setStartLocation({ lng, lat });

        // } else {
        //     setEndLocation({ lng, lat });
        // }
        if (type === "start") {
            setStartLocation({
                lng: lng,
                lat: lat,
                label: selectedOption.label, // Lưu luôn tên địa điểm
            });
        } else {
            setEndLocation({
                lng: lng,
                lat: lat,
                label: selectedOption.label, // Lưu luôn tên địa điểm
            });
        }
    }

    const handleCalculatePrice = async () => {
        const vehicleTypes = [...new Set(freeDriversInDistance.map(driver =>
            JSON.stringify({ id: driver.vehicleType.id, model: driver.vehicleType.model, seat: driver.vehicleType.seat })))].map(item => JSON.parse(item))
        for (const type of vehicleTypes) {
            try {
                const [response, error] = await BookingService.calculatePrice(kilometer, type)
                const data = response.data.price
                setPriceByVehicleType(pre => {
                    const filtered = pre.filter(item => item.vehicleType.id != type.id)
                    return [...filtered, { price: data, vehicleType: type }]

                })
            } catch (error) {
                console.log('Không thể lấy giá tiền chuyến xe ', error)
            }

        }
    }
    const fetchFreeDrivers = async () => {
        try {
            const [response, errors] = await DriverService.getAllDriversFree()
            setFreeDrivers(response.data)

        } catch (error) {
            if (error.code) {
                toast.error(getMessage(error.code))
            }
        }

    }

    const handleVehicleTypeChange = async (vehicleTypeId) => {
        const [response, data] = await DriverService.getAllDriversFreeByVehicleType(vehicleTypeId);
        if (error) {
            console.error("Lỗi khi lấy danh sách tài xế theo loại xe:", error);
            return
        }
        setFreeDrivers(response.data);

    };



    const handleShowDiverLocation = () => {
        markerRef.current.forEach((marker) => marker.remove());
        markerRef.current = []
        if (freeDriversInDistance && freeDriversInDistance.length > 0) {
            freeDriversInDistance.forEach(driver => {
                const marker = CustomMaker({
                    coordinates: { lat: driver.latitude, lng: driver.longitude },
                    description: '',
                    imageUrl: driver.car.image,
                    link: '',
                    car: driver.car,
                    map: mapRef.current,
                    name: driver.name,
                    driverImage: driver.avatar,
                    role: "CUSTOMER"
                })

                markerRef.current.push(marker)
            });
        }
    }

    const handleChosingRoute = (e) => {
        if (!startLocation?.lat || !startLocation?.lng || !endLocation?.lat || !endLocation?.lng) {
            e.preventDefault();
            toast.warn('Vui lòng chọn điểm đón và điểm đến để đặt chuyến xe!');
            return;
        }

        // Kiểm tra nếu điểm đón trùng điểm đến
        if (startLocation.lat === endLocation.lat && startLocation.lng === endLocation.lng) {
            e.preventDefault();
            setError("Điểm đón không được trùng với điểm đến");
            return;
        }

        // Nếu hợp lệ thì chuyển trang
        // navigate('/confirm-booking'); 
    };


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
            }
            if (startLocation && endLocation) {
                // getRoute();
                if (mapRef.current.popup) {
                    mapRef.current.popup.remove();
                } 
                console.log(mapRef.current.popup)
                const { route, kilometer } = await MapService.getRoute(startLocation, endLocation, mapRef);
                drawRoute(route.geometry, "blue", "route")
                setKilometer(kilometer)
            }
        }
        fetchRoute()

    }, [startLocation, endLocation])



    useEffect(() => {
        fetchVehicleType()
    }, []);

    useEffect(() => {

        if (!startLocation && freeDrivers.length == 0 && vehicleTypeSelected != 'all') return;
        const driversInRadius = (freeDrivers ?? []).filter(driver => {
            if (!driver) return false; // Kiểm tra nếu driver không hợp lệ
            const driverCoords = { lat: driver.latitude, lng: driver.longitude };
            return haversineDistance(startLocation, driverCoords) <= radius;
        });
        if (vehicleTypeSelected == 'all') {
            setAllFreeDriversInDistance(driversInRadius)
        }
        setFreeDriversInDistance(driversInRadius)
    }, [startLocation, freeDrivers])

    useEffect(() => {
        if (freeDriversInDistance.length > 0) {
            handleShowDiverLocation();
            if (kilometer && kilometer > 0) {
                handleCalculatePrice()
            }
        }

    }, [freeDriversInDistance, kilometer]);
    const fetchVehicleType = async () => {
        const [response, error] = await VehicleTypeService.getAllVehicleType()
        if (error) {
            console.log("Lỗi khi lấy thông tin loại xe: ", error)
            return
        }
        setVehicleType(response.data)
    }
    // console.log(freeDriversInDistance, freeDrivers)
    return (
        <>
            <Breadcrumb
                routes={[
                    { path: "/booking", name: "Đặt xe", icon: "booking" },
                ]}
            />
            <div className="mb-40">
                <section className="mx-30 mt-10">
                    <Form>
                        <div className="destination-box border gap-x-4 border-blue-600 w-full rounded-lg grid grid-cols-1 lg:grid-cols-[8fr_1fr]  ">
                            <div>

                                <div className="p-2 grid grid-cols-1 lg:grid-cols-[10fr_1/2fr]">
                                    {/* <label htmlFor="departure">Điểm đi</label> */}
                                    <div className="flex w-full items-center justify-center relative">
                                        <SelectOption onInputChange={setSearchText} options={suggestions} placeholder="Điểm đón" type="start"
                                            onchange={(selectedOption) => {
                                                handleSelectedLocation(selectedOption, 'start'),
                                                    setError("")
                                            }}
                                            // value={
                                            //     startLocation?.lng && startLocation?.lat
                                            //         ? suggestions.find(option => option.value == `${startLocation.lng},${startLocation.lat}`)
                                            //         : null // Nếu chưa chọn thì không có giá trị
                                            // }
                                        ></SelectOption>
                                        <div className="m-0 absolute left-1/2 -translate-x-1/2 z-10">
                                            <div className="cursor-pointer bg-white border border-gray-300 shadow-xl w-10 h-10 rounded-full flex items-center justify-center">
                                                <HiSwitchHorizontal className="text-blue-800 text-xl" />
                                            </div>
                                        </div>
                                        <SelectOption onInputChange={setSearchText} options={suggestions} placeholder="Điểm đến" type="end"
                                            onchange={(selectedOption) => handleSelectedLocation(selectedOption, 'end')}
                                            // value={
                                            //     endLocation?.lng && endLocation?.lat
                                            //         ? suggestions.find(option => option.value == `${endLocation.lng},${endLocation.lat}`)
                                            //         : null
                                            // }
                                        ></SelectOption>
                                    </div>

                                </div>
                            </div>
                            <div className="h-full flex flex-col justify-center mr-5">
                                <select
                                    onChange={(e) => {
                                        setVehicleTypeSelected(e.target.value)
                                    }}
                                    name="vehicleType"
                                    className="border rounded-lg focus:border-[#dde2e8] appearance-none text-center text-gray-600
                                    focus:shadow-[0_8px_5px_rgba(156,188,231,0.5)] border-[#dde2e8] p-3 focus:outline-none"
                                >
                                    <option value="all">Tất cả loại xe</option>
                                    {vehicleType?.length > 0 &&
                                        vehicleType.map((type, index) => (
                                            <option key={index} value={type.id}>
                                                {type.model} - {type.seat} chỗ
                                            </option>
                                        ))}
                                </select>

                            </div>

                        </div>
                        {error && (<><p className="text-center italic text-red-500 mt-3">{error}</p></>)}
                    </Form>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]   my-10 mx-30 h-[450px] max-h-[450px] ">
                    <div className="p-3 border mr-2 overflow-y-auto min-h-[450px] ">
                        {isLoging ? (
                            <>
                                {freeDriversInDistance && freeDriversInDistance.map((driver, index) => (
                                    <Link onClick={handleChosingRoute} key={index} to="/confirm-booking"
                                        state={{
                                            startLocation, endLocation, driver, priceByVehicleType, kilometer, users: allFreeDriversInDistance,
                                            price: priceByVehicleType.find(priceByVehicleType => priceByVehicleType.vehicleType.id == driver.vehicleType.id)?.price || 0
                                        }}

                                    >
                                        <DiverFree name={driver.name} key={index} car={driver.car.description} img={driver.car.image}
                                            price={priceByVehicleType.find(priceByVehicleType => priceByVehicleType.vehicleType.id == driver.vehicleType.id)?.price || 0}
                                            star={driver.star} seat={driver.vehicleType.seat}
                                        />
                                    </Link>
                                ))}
                            </>

                        ) : (
                            <p className="italic text-red-500 text-center ">Vui lòng đăng nhập để xem danh sách chuyến xe!</p>
                        )}

                    </div>

                    <div>

                        <div className="">
                            <div id='map-container' ref={mapContainerRef} />
                        </div>

                    </div>
                </section>
            </div>
        </>
    )
}
export default Booking 
