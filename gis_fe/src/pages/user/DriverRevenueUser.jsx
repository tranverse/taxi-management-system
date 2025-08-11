import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { parseISO, startOfWeek, format } from "date-fns";
import StatisticService from "@services/Statistic.service";
import Breadcrumb from "@components/Breadcrumb";
import DriverService from "@services/Driver.service";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import icon mũi tên
import { BiMoneyWithdraw } from "react-icons/bi";
import { useParams } from "react-router-dom";
import Heading from "@components/Heading";
const DriverRevenueUser = () => {
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState("week");
    const [driver, setDriver] = useState({})
    const { driverId } = useParams()
    const fetchDriverInfo = async () => {
        const [response, error] = await DriverService.getDriverDetail(driverId)
        if (error) {
            console.log("Lỗi khi lấy thông tin tài xế: ", error)
        }
        setDriver(response.data)
    }
    useEffect(() => {
        fetchDriverInfo()
    }, [])
    console.log(data)
    useEffect(() => {
        const getAvenueByDate = async () => {
            const [response, error] = await StatisticService.getRevenueByDriver(driver?.id)
            if (error) {
                console.log("Lỗi lấy doanh thu tài xế: ", error)
                return
            }
            setData(response.data)
        }
        getAvenueByDate()
    }, [driver.id])

    const ITEMS_PER_PAGE = 7; // Số lượng dữ liệu hiển thị mỗi trang

    const formatDate = (date) => {
        if (!date) return ""; // Tránh lỗi khi date bị undefined hoặc null

        try {
            if (viewMode === "week") {
                return date; // Vì week đã được format trước đó
            }
            if (viewMode === "month") {
                return date; // Trả về trực tiếp vì đã là "MM/yyyy"
            }
            return format(parseISO(date), "dd/MM/yyyy");
        } catch (error) {
            console.error("Lỗi định dạng ngày: ", date, error);
            return date; // Trả về nguyên gốc nếu không thể parse
        }
    };


    const getDisplayedData = () => {
        if (viewMode === "week") {
            return getWeekData(currentIndex);
        } else {
            return getMonthData(currentIndex);
        }
    };



    const getWeekData = (index) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - index * 7);
        const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });

        const weekData = Array.from({ length: 7 }, (_, i) => ({
            date: format(new Date(weekStart.getTime() + i * 86400000), "dd/MM/yyyy"),
            revenue: 0,
            tripCount: 0,
        }));

        data.forEach(item => {
            const formattedDate = format(parseISO(item.date), "dd/MM/yyyy");
            const foundIndex = weekData.findIndex(day => day.date === formattedDate);

            if (foundIndex !== -1) {
                weekData[foundIndex].revenue = item.revenue;
                weekData[foundIndex].tripCount = item.tripCount;
            }
        });

        return weekData;
    };



    const getMonthData = () => {
        const currentYear = new Date().getFullYear();

        // Tạo danh sách 12 tháng từ 01/yyyy đến 12/yyyy
        const fullYearData = Array.from({ length: 12 }, (_, i) => ({
            date: format(new Date(currentYear, i, 1), "MM/yyyy"),
            revenue: 0,
            tripCount: 0,
        }));

        // Gán dữ liệu từ API vào đúng tháng
        data.forEach(item => {
            const itemMonth = format(parseISO(item.date), "MM/yyyy");
            const foundIndex = fullYearData.findIndex(month => month.date === itemMonth);

            if (foundIndex !== -1) {
                fullYearData[foundIndex].revenue += item.revenue;
                fullYearData[foundIndex].tripCount += item.tripCount;
            }
        });

        return fullYearData;
    };

    const views = [
        { key: "week", label: "Tuần" },
        { key: "month", label: "Tháng" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => prev + 1); // Lùi về tuần/tháng trước
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0)); // Không cho vượt quá tuần/tháng hiện tại
    };



    return (
        <>

            <Heading message={"Doanh thu tài xế"} className="text-lg mb-3"></Heading>


            <div className="mx-5 px-3 py-3 rounded-lg bg-white">
                <div className="flex justify-end mb-4 ">
                    <select
                        className="px-9 py-2 rounded border border-gray-300 bg-white shadow-md appearance-none"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                    >
                        {views.map(view => (
                            <option key={view.key} value={view.key}>
                                {view.label}
                            </option>
                        ))}
                    </select>

                </div>

                <div>

                    <div className="flex justify-between w-full  mb-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                            onClick={handlePrev}
                        >
                            Trước
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                            onClick={handleNext}
                        >
                            Sau
                        </button>

                    </div>
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                            data={getDisplayedData()}
                            margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
                            barCategoryGap={20} // Thêm khoảng cách giữa các cột
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(tick) => formatDate(tick)}
                            />
                            <YAxis
                                tickFormatter={(value) => value.toLocaleString()} // Định dạng số trên trục Y
                            />
                            <Tooltip
                                formatter={(value) => value.toLocaleString()} // Định dạng số khi hover
                            />
                            <Legend />
                            <Bar
                                dataKey="revenue"
                                fill="#8884d8"
                                name="Doanh thu (VNĐ)"
                            >
                                {/* Hiển thị giá trị trên cột */}
                                <LabelList
                                    dataKey="revenue"
                                    position="top"
                                    formatter={(value) => `${value.toLocaleString()} `}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>


                </div>

            </div>
        </>
    )
}

export default DriverRevenueUser