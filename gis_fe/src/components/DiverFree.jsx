import React from "react";
import Logo from "@assets/images/4cho.jpg";
import { FaCarSide } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { formatNumber } from "@utils/formatNumber";

const DiverFree = ({name, car, star, img, price, seat}) => {
    return (
        <>
            <div className=" py-2 mb-3 px-2 flex justify-between items-center border border-blue-400  rounded-lg cursor-pointer
                            hover:shadow-lg hover:bg-blue-50">
                <div className=" flex justify-center items-center">
                    <div>
                        <img src={img} alt="" width={100} height={200} className="rounded" />
                        {/* <FaCarSide /> */}
                    </div>
                    <div className="ml-3">
                        <p>Tài xế: {name}</p>
                        {/* <p>Biển số: {car}</p> */}
                        <p>Loại xe: {car}</p>
                        <p>Số chỗ: {seat}</p>
                        <div className="flex items-center ">
                            <p>Đánh giá: {star.toFixed(1)}</p>
                            <div className="ml-0 flex ">
                                <CiStar className="text-xl"/>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    {/* <p className="text-sm italic text-center">12 km</p> */}
                    <p> {formatNumber(price)}đ</p>
                </div>
            </div>
        </>
    )
}

export default DiverFree