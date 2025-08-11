import DriverService from '@services/Driver.service'
import React, { useEffect, useState } from 'react'
import Heading from '@components/Heading'
import { useNavigate, useParams, Link } from 'react-router-dom'
import DriverRating from '@components/DriverRating'
import ReviewService from '@services/Review.service'
import MapService from '@services/Map.service'
const DriverDetailUser = () => {
  const [driver, setDriver] = useState({})
  const [bookings, setBookings] = useState([])
  const [updatedBookings, setUpdatedBookings] = useState([])
  const [pointReview, setPointReview] = useState([])
  const { driverId } = useParams()
  const navigate = useNavigate()
  const fetchDriverInfo = async () => {
    const [response, error] = await DriverService.getDriverDetail(driverId)
    if (error) {
      console.log("Lỗi khi lấy thông tin tài xế: ", error)
      return
    }
    setDriver(response.data)
  }
  const fetchBookingList = async () => {
    const [response, error] = await DriverService.getAllDriverBookings(driver?.id);
    if (error) {
      console.log("Lỗi không thể lấy danh sách chuyến xe của tài xế: ", error)
      return
    }
    setBookings(response.data)
  }
  const fetchPointReview = async () => {
    const [response, error] = await ReviewService.getReviewByDriver(driver?.id);
    if (error) {
      console.log("Lỗi không thể lấy danh sách chuyến xe của tài xế: ", error)
      return
    }
    setPointReview(response.data)
  }

  useEffect(() => {
    fetchDriverInfo();
  }, []);

  useEffect(() => {
    if (driver?.id) {
      fetchBookingList();
      fetchPointReview()
    }
  }, [driver]);

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
        setUpdatedBookings(updatedBookings);
      };
      fetchLocations();
    }
  }, [bookings]);
  return (
    <>
      <div className="">
        <Heading message="Thông tin cá nhân"></Heading>
        <div className="container mx-auto p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_2fr] gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border border-blue-400">
              <div className="border-b-4 border-green-500 pb-4 flex flex-col items-center justify-center text-center">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s" alt="" height={250} width={250} className='rounded' />
                <h2 className="text-xl font-bold">
                  {driver?.name}
                </h2>


              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Trạng thái
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {driver?.status == "ACTIVE" ? "Đang hoạt động" :
                      driver?.status == "INACTIVE" ? "Ngưng hoạt động" :
                        "Bị chặn"
                    }
                  </span>
                </div>

              </div>
              <div className="flex justify-center mt-4 ">
                <Link to={`/user/driver-statistic/${driver?.id}`}>
                  <button className="px-6 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md cursor-pointer
                   hover:bg-blue-500 transition duration-300">
                    Doanh thu
                  </button>
                </Link>
              </div>

            </div>
            <div className="bg-white p-4 rounded-lg shadow-md col-span-2 border border-blue-400">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">
                      Họ tên:
                    </span>
                    <span className=''>
                      {driver?.name}
                    </span>

                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">
                      Giới tính:
                    </span>
                    <span className=''>
                      {driver?.gender == 1 ? "Nam" : "Nữ"}
                    </span>

                  </p>

                  <p className="text-gray-600">
                    <span className="font-bold mr-3">
                      Email:
                    </span>
                    <span>
                      {driver?.email}
                    </span>

                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">
                      Số điện thoại:
                    </span>
                    <span>
                      {driver?.phone}
                    </span>

                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">Số GPLX:</span>
                    <span>{driver?.driverLicense}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">Vai trò:</span>
                    <span>{driver?.role == "DRIVER" ? "Tài xế" : "Nhân viên"}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">Trạng thái:</span>
                    <span>
                      {driver?.driverStatus === "FREE" ? "Rảnh" :
                        driver?.driverStatus === "OFF" ? "Nghỉ" :
                          driver?.driverStatus === "BUSY" ? "Đang chở khách" :
                            "Không hoạt động"}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">
                      Xe:
                    </span>
                    <span>
                      {driver?.car?.description}
                    </span>

                  </p>
                </div>
              </div>
              <hr className='my-4' />
              <div className="mt-4 flex gap-10">
                <div>
                  <img src={driver?.car?.image} width={150} className='rounded' alt="" />

                </div>
                <div>

                  <p className="text-gray-600">
                    <span className="font-bold mr-3">Tên xe:</span>
                    <span>{driver?.car?.description}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold mr-3">Biển số:</span>
                    <span>{driver?.car?.licensePlate}</span>
                  </p>
                </div>

              </div>
              <hr className='my-4' />
              <div>
                <DriverRating criteria={pointReview} rating={driver?.star}></DriverRating>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md border  border-blue-400 mt-5">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Danh sách chuyến xe</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-gray-100">
                    {["STT", "Thời gian", "Địa điểm", "Khách hàng", "Trạng thái",].map((header) => (
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
                    <tr key={booking.id} onClick={() => navigate(`/user/driver/booking-detail/${booking.id}`)}
                      className="hover:bg-blue-50 transition cursor-pointer " >
                      <td className="py-3 px-4 border-b">{index + 1}</td>
                      <td className="py-3 px-4 border-b">
                        <div>
                          <p className="font-medium text-gray-700">{new Date(booking.bookingTime).toLocaleString("vi-VN")}</p>
                          {booking.finishTime && (
                            <p className="font-medium text-gray-700">{new Date(booking.finishTime).toLocaleString("vi-VN")}</p>
                          )}                        </div>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div>
                          <p className="text-gray-700"><span className="font-medium">Điểm đón:</span> {booking.startLocationName || "N/A"}</p>
                          <p className="text-gray-700"><span className="font-medium">Điểm đến:</span> {booking.endLocationName || "N/A"}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b text-gray-700 font-medium">{booking?.customer.name || "Không có"}</td>

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
                  {updatedBookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">Tài xế chưa có chuyến xe</td>
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

export default DriverDetailUser