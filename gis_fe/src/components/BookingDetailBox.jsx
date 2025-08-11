import React from 'react'
import ReadOnlyInput from './ReadOnlyInput'
import { formatNumber } from '@utils/formatNumber'
import { BsCoin } from "react-icons/bs";
import { CiStar } from "react-icons/ci";

const BookingDetailBox = ({ driver, customer, startLocationName, endLocationName, booking }) => {
    return (
        <>
            <div className="p-3 border mr-2 rounded-lg border-blue-400">
                <p className="uppercase text-center font-semibold text-lg text-blue-600 ">Thông tin đặt xe</p>
                <div className="grid grid-rows-1 ">
                    <p className="my-2 text-base font-semibold">Thông tin khách hàng</p>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-2">
                        <ReadOnlyInput value={customer?.name} label="Họ tên"></ReadOnlyInput>
                        <ReadOnlyInput value={customer?.phone} label="Số điện thoại"></ReadOnlyInput>
                    </div>
                    <p className="my-2 text-base font-semibold">Thông tin tài xế</p>
                    <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_1.5fr_1fr] gap-4">
                        <ReadOnlyInput value={driver?.name} label="Họ tên"></ReadOnlyInput>

                        <ReadOnlyInput value={driver?.phone} label="Số điện thoại"></ReadOnlyInput>

                        <div className="w-full flex flex-col">
                            <label htmlFor="" className="text-[12px] text-gray-600">Đánh giá</label>
                            <div className="flex items-center ">
                                <p className="m-0">{(driver?.star)?.toFixed(1)}/5</p>
                                <CiStar className=""></CiStar>
                            </div>
                            <hr className="border-t border-black mt-1" />

                        </div>
                    </div>
                </div>

                <p className="my-2 text-base font-semibold">Thông tin xe</p>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-4">
                    <div className="p-0 m-0 items-center">
                        <img src={driver?.car?.image} width={100} height={150} className="rounded" alt="" />
                    </div>
                    <ReadOnlyInput value={driver?.vehicleType?.model} label="Loại xe"></ReadOnlyInput>
                    <ReadOnlyInput value={driver?.vehicleType?.seat} label="Số chỗ"></ReadOnlyInput>
                </div>
                <p className="my-2 text-base font-semibold">Thông tin chuyến xe</p>
                <div className="">
                    <div className='flex gap-10'>

                        <ReadOnlyInput value={new Date(booking.bookingTime).toLocaleString("vi-VN")} label="Thời gian bắt đầu"></ReadOnlyInput>
                        {booking.finishTime && (
                            <ReadOnlyInput value={new Date(booking.finishTime).toLocaleString("vi-VN")} label="Thời gian kết thúc"></ReadOnlyInput>

                        )}
                    </div>

                    <ReadOnlyInput value={startLocationName} label="Điểm đón"></ReadOnlyInput>
                    <ReadOnlyInput value={endLocationName} label="Điểm đến"></ReadOnlyInput>

                    <div className="leading-7">

                        <div className="flex items-center justify-between mt-3">
                            <div>
                                <p className="font-bold">Khoảng cách: {booking.kilometer} km</p>
                            </div>
                            <div>
                                <p className="font-bold">Giá tiền: {formatNumber(booking.price + booking.memberDiscount + booking.accumulatedDiscount)} đ</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold">Giảm thành viên: </p>
                            <p className="font-bold">- {formatNumber((booking.memberDiscount))} đ</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center ">
                                <BsCoin className="text-yellow-500 mr-2" />
                                <p className="font-bold">Điểm tích lũy: </p>
                            </div>
                            <p className="font-bold"> - {formatNumber(booking.accumulatedDiscount)} đ</p>
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
    )
}

export default BookingDetailBox