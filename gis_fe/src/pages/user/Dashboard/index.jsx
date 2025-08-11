import React, { useState, useEffect, useRef } from "react";
import Heading from "@components/Heading";
import mapboxgl from "mapbox-gl";
import '../../customer/.scss'
import useInitialMap from "@hooks/useInitialMap";
import DriverService from "@services/Driver.service";
import CustomMaker from "@components/Map/CustomMaker";
import { Link } from "react-router-dom";
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;

function Dashboard() {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const markerRef = useRef([])
    const [freeDrivers, setAllFreeDrivers] = useState([])
    const [busyDrivers, setBusyDrivers] = useState([])
    const [selectedTab, setSelectedTab] = useState("free")

    useInitialMap({ mapRef, mapContainerRef })
    const fetchAllFreeDriver = async () => {
        const [response, error] = await DriverService.getAllDriversFree()
        if (error) {
            console.log("Lỗi khi lấy danh sách tài xế rảnh: ", error)
            return
        }
        setAllFreeDrivers(response.data)
    }
    const fetchAllBusyDriver = async () => {
        const [response, error] = await DriverService.getAllDriversBusy()
        if (error) {
            console.log("Lỗi khi lấy danh sách tài xế bận: ", error)
            return
        }
        setBusyDrivers(response.data)
    }
    const handleShowDrivers = (drivers) => {
        markerRef.current.forEach(marker => marker.remove()); // Xóa các marker cũ
        markerRef.current = []
        const bounds = new mapboxgl.LngLatBounds(); // Tạo đối tượng giới hạn bản đồ

        for(const freeDriver of drivers){
            const coordinates = [freeDriver.longitude, freeDriver.latitude];
            const marker = CustomMaker({
                map: mapRef.current,
                car: freeDriver.car,
                coordinates: [freeDriver.longitude, freeDriver.latitude],
                description: freeDriver?.car?.description,
                imageUrl: freeDriver?.car?.image,
                link: '',
                name: freeDriver.name,
                driverImage: freeDriver.avatar,
                isBusy: freeDriver.driverStatus,
                driverId: freeDriver.id
            })
            markerRef.current.push(marker)
            bounds.extend(coordinates); 

        }
        if (drivers.length > 0) {
            mapRef.current.fitBounds(bounds, {
                padding: 50, // Khoảng cách padding xung quanh điểm
                maxZoom: 15, // Giới hạn zoom tối đa
                duration: 1000 // Thời gian chuyển đổi
            });
        }
    }

    const handleTabClick = (tab) => {
        setSelectedTab(tab)
    }
    const getCurrentData = () => {
        switch (selectedTab){
            case "busy":
                return busyDrivers;
            case "free":
            default:
                return freeDrivers
        }
    }
    useEffect(() => {
        fetchAllFreeDriver()
        fetchAllBusyDriver()
    }, [])

    useEffect(() => {
        handleShowDrivers(getCurrentData());
    }, [selectedTab, freeDrivers, busyDrivers]); 
    return (
        <>
            <div className=" m-4">

                <div className="mb-5">
                    <Heading className="text-xl" message="Các chuyến xe đang thực hiện"></Heading>
                </div>
                <div>
                    <div className="flex justify-center  font-semibold items-center bg-white shadow-lg rounded gap-30 px-20 py-4 mb-2">

                        <div onClick={() => handleTabClick("free")}  className={`cursor-pointer 
                            ${selectedTab == "free" ? "text-blue-400 " : ""} hover:text-blue-400`}>
                            <p>Xe đang rảnh</p>
                        </div>
                        <div onClick={() => handleTabClick("busy")} className={`
                        ${selectedTab == "busy" ? "text-blue-400 " : ""} cursor-pointer hover:text-blue-4001`}>
                            <p>Xe đang thực hiện</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-3 lg:justify-between ">
                        <div className="bg-white px-2 py-4 rounded-lg w-full lg:w-1/4">
                            <h3 className="text-center mb-2">Danh sách tài xế</h3>
                            {getCurrentData().length > 0 && getCurrentData().map((driver, index) => (
                                <Link to={`/user/driver-detail/${driver.id}` } key={index}>
                                
                                    <div className="p-2 flex space-x-4 hover:bg-blue-50" key={index}>
                                        <img src={driver?.car?.image} width={80} height={100} className="rounded" alt="" />
                                        <div>
                                            <p>{driver.name}</p>
                                            <p className="text-sm italic text-gray-500">{driver?.car?.description} - {driver?.car?.licensePlate}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                        </div>
                        <div className="border border-blue-400 rounded w-full lg:w-3/4">
                            <div id='map-container' ref={mapContainerRef} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard