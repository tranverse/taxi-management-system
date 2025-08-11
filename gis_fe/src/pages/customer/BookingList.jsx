import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import CustomerService from '@services/Customer.service';
import BookingService from '@services/Booking.service';
import MapService from '@services/Map.service';
import ReadOnlyInput from '@components/ReadOnlyInput';
import { Link, useNavigate } from 'react-router-dom';
import { formatNumber } from '@utils/formatNumber';
import Breadcrumb from '@components/Breadcrumb';
const BookingList = () => {
    const [customer, setCustomer] = useState({})
    const [bookings, setBookings] = useState([])
    const [updatedBookings, setUpdatedBookings] = useState([])
    const navigate = useNavigate()
    const fetchCustomerInfo = async () => {
        const [response, error] = await CustomerService.info()
        if (error) {
            console.log('Không thể lấy thông tin khách hàng ', error)
            return
        }
        setCustomer(response.data)
    }
    console.log(bookings)
    useEffect(() => {
        if (bookings.length > 0) {
            const fetchLocations = async () => {
                const updatedBookings = await Promise.all(
                    bookings.map(async (booking) => {
                        const startLocationName = await MapService.fetchNameLocation(booking.startingX, booking.startingY) || "Không xác định";
                        const endLocationName = await MapService.fetchNameLocation(booking.destinationX, booking.destinationY) || "Không xác định";

                        return { ...booking, startLocationName, endLocationName };
                    })
                );
                setUpdatedBookings(updatedBookings); // Cập nhật state với danh sách mới
            };
            fetchLocations();
        }
    }, [bookings]); // Chỉ chạy 1 lần khi component mount



    const fetchBookingList = async () => {
        const [response, error] = await CustomerService.getAllCustomerBookings(customer?.id);
        if (error) {
            console.log("Lỗi không thể lấy danh sách chuyến xe của khách hàng: ", error)
            return
        }
        setBookings(response.data)
    }
    useEffect(() => {
        fetchCustomerInfo();
    }, []);

    useEffect(() => {
        if (customer.id) {
            fetchBookingList();
        }
    }, [customer]);
    return (
        <>

            <Breadcrumb
                routes={[
                    { path: "/booking", name: "Thông tin cá nhân ", icon: "profile" },
                ]}
            />

            <div className="max-w-7xl mx-auto mt-5 px-6 mb-20">
                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white p-5 rounded-lg shadow-md border border-blue-400">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Thông tin khách hàng</h2>
                        <div className="flex flex-col md:flex-row md:justify-center gap-6">
                            <div class="pb-4 flex flex-col items-center justify-center text-center">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s" alt="" height={250} width={250} className='rounded' />


                            </div>
                            <div className="w-full md:w-1/2">
                                <ReadOnlyInput value={customer?.name} className="mb-3" label="Họ tên" />
                                <ReadOnlyInput value={customer?.phone} className="mb-3" label="Số điện thoại" />
                                <ReadOnlyInput value={customer?.email} className="mb-3" label="Email" />
                            </div>
                            <div className="w-full md:w-1/2">
                                <div className='flex gap-4'>
                                    <ReadOnlyInput value={customer?.accumulate} className="mb-3" label="Điểm tích lũy" />
                                    <ReadOnlyInput value={customer?.total} className="mb-3" label="Tổng tích lũy" />

                                </div>
                                <ReadOnlyInput value={customer?.type?.name} className="mb-3" label="Thứ hạng" />
                                <ReadOnlyInput value={customer?.status == "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"} className="mb-3" label="Trạng thái" />

                            </div>
                        </div>
                    </div>

                    {/* Booking List */}
                    <div className="bg-white p-5 rounded-lg shadow-md border  border-blue-400">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Danh sách chuyến xe</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {["STT", "Thời gian", "Địa điểm", "Tài xế", "Tổng tiền", "Trạng thái"].map((header) => (
                                            <th
                                                key={header}
                                                className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700 uppercase"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>

                                    {updatedBookings.map((booking, index) => (
                                        <tr key={booking.id} onClick={() => navigate(`/booking/detail/${booking.id}`)}
                                            className="hover:bg-blue-50 transition cursor-pointer " >
                                            <td className="py-3 px-4 border-b">{index + 1}</td>
                                            <td className="py-3 px-4 border-b">
                                                <div>
                                                    <p className="font-medium text-gray-700">{new Date(booking.bookingTime).toLocaleString("vi-VN")}</p>
                                                    {booking.finishTime && (
                                                        <p className="font-medium text-gray-700">{new Date(booking.finishTime).toLocaleString("vi-VN")}</p>
                                                    )}

                                                </div>
                                            </td>
                                            <td className="py-3 px-0 border-b">
                                                <div>
                                                    <p className="text-gray-700"><span className="font-medium">Điểm đón:</span> {booking.startLocationName || "N/A"}</p>
                                                    <p className="text-gray-700"><span className="font-medium">Điểm đến:</span> {booking.endLocationName || "N/A"}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 border-b text-gray-700 font-medium">{booking.user?.name || "Không có"}</td>
                                            <td className="py-3 px-4 border-b">
                                                <span className="px-3 py-1 text-base font-semibold rounded-full bg-blue-100 text-blue-700">
                                                    {formatNumber(booking.price)} đ
                                                </span>
                                            </td>
                                            <td className="py-3 px-0 border-b text-center">
                                                {booking?.statuses?.some(status => status.bookingStatus === "REJECTED") ? (
                                                    <span className="px-3 py-1 text-base font-semibold rounded-full bg-red-100 text-red-700">
                                                        Từ chối
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-base font-semibold rounded-full bg-green-100 text-green-700">
                                                        Hoàn thành
                                                    </span>
                                                )}
                                            </td>



                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default BookingList