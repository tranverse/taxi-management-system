import DriverService from '@services/Driver.service'
import React, { useEffect, useState } from 'react'
import Heading from '@components/Heading'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaSearch } from "react-icons/fa"

const DriverList = () => {
    const [freeDrivers, setFreeDrivers] = useState([])
    const [busyDrivers, setBusyDrivers] = useState([])
    const [inactiveDrivers, setInactiveDrivers] = useState([])
    const [offDrivers, setOffDrivers] = useState([])
    const [selectedTab, setSelectedTab] = useState("free")
    const navigate = useNavigate()
    const fetchAllDrivers = async () => {
        try {
            const results = await Promise.all([
                DriverService.getAllDriversFree(),
                DriverService.getAllDriversBusy(),
                DriverService.getAllDriversInactive(),
                DriverService.getAllDriversOff()
            ]);

            const [[freeData, freeError], [busyData, busyError], [inactiveData, inactiveError], [offData, offError]] = results;

            if (!freeError) setFreeDrivers(freeData?.data || []);
            if (!busyError) setBusyDrivers(busyData?.data || []);
            if (!inactiveError) setInactiveDrivers(inactiveData?.data || []);
            if (!offError) setOffDrivers(offData?.data || []);

            if (freeError) console.error("❌ Lỗi khi lấy tài xế rảnh:", freeError);
            if (busyError) console.error("❌ Lỗi khi lấy tài xế bận:", busyError);
            if (inactiveError) console.error("❌ Lỗi khi lấy tài xế chờ duyệt:", inactiveError);
            if (offError) console.error("❌ Lỗi khi lấy tài xế không hoạt động:", offError);

        } catch (error) {
            console.error("❌ Lỗi khi gọi API tài xế:", error);
        }
    };
    const handleTabClick = (tab) => {
        setSelectedTab(tab)
    }
    const getCurrentData = () => {
        switch (selectedTab) {
            case "busy":
                return busyDrivers;
            case "off":
                return offDrivers
            case "inactive":
                return inactiveDrivers
            default:
                return freeDrivers
        }
    }
    useEffect(() => {
        fetchAllDrivers()
    }, [])

    return (
        <>
            <Heading message="Danh sách tài xế" className="text-lg"></Heading>
            <div className="container mx-auto px-4">

                <div className="bg-white rounded shadow ">
                    <div className=" p-3">
                        <ul className="flex">
                            <li className="mr-4">
                                <button
                                    className={`inline-block py-2 px-4 ${selectedTab === "free" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                                    onClick={() => handleTabClick("free")}
                                >
                                    Tài xế rảnh
                                </button>
                            </li>
                            <li className="mr-4">
                                <button
                                    className={`inline-block py-2 px-4 ${selectedTab === "busy" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                                    onClick={() => handleTabClick("busy")}
                                >
                                    Tài xế bận
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`inline-block py-2 px-4 ${selectedTab === "off" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                                    onClick={() => handleTabClick("off")}
                                >
                                    Tài xế không hoạt động
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`inline-block py-2 px-4 ${selectedTab === "inactive" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                                    onClick={() => handleTabClick("inactive")}
                                >
                                    Tài xế chờ duyệt
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="px-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className='border-t'>
                                        <th className="py-2 px-4 border-b">#</th>
                                        <th className="py-2 px-4 border-b">Họ tên</th>
                                        <th className="py-2 px-4 border-b">Email</th>
                                        <th className="py-2 px-4 border-b">Xe</th>
                                        <th className="py-2 px-4 border-b">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getCurrentData().length > 0 && getCurrentData().map((data, index) => (
                                        <tr key={index} className='hover:bg-blue-50 cursor-pointer'
                                            onClick={() => navigate(`/user/driver-detail/${data.id}`)}>
                                            <td className="text-center py-8">{index + 1}</td>
                                            <td className="text-center py-8">{data?.name}</td>
                                            <td className="text-center py-8">
                                                {data?.email}
                                            </td>
                                            <td className="text-center py-8">{data?.car?.description}</td>

                                            <td className="text-center py-8">

                                            </td>

                                        </tr>
                                    ))}
                                    {getCurrentData().length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                                        </tr>
                                    )}
                                    


                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DriverList