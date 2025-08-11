import ReviewService from "@services/Review.service";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

const DriverRating = ({ rating, criteria, text = "", isAverage = false }) => {
    const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF3333"];
    const [criteriaName, setCriteriaName] = useState([]);

    const data = [
        { name: "Rating", value: rating },
        { name: "Remaining", value: 5 - rating }
    ];
    useEffect(() => {
        const fetchAllCriteria = async () => {
            const [response, error] = await ReviewService.getCriteria();
            if (error) {
                console.log("Lỗi không load được tiêu chí đánh giá: ", error);
                return;
            }
            setCriteriaName(response.data);
        };
        fetchAllCriteria();
    }, []);

    return (
        <div className="flex items-center ">
            {/* Vòng tròn đánh giá */}
            {rating != null && (

                <div className="flex flex-col items-center">

                    <div className="relative w-28 h-28 flex flex-col items-center justify-center">
                        <PieChart width={110} height={110}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={42}
                                outerRadius={52}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                            >
                                <Cell fill={COLORS[Math.floor(rating)]} />
                                <Cell fill="#E0E0E0" />
                            </Pie>
                        </PieChart>
                        <div className="absolute text-3xl text-yellow-500 font-bold">⭐</div>
                    </div>
                    <div className="ml-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{rating?.toFixed(1)}/5</p>
                        <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                    </div>
                </div>
            )}


            {criteria.length == 0 ? (
                <p className="font-semibold italic text-blue-400">Không có đánh giá</p>
            ) : (

                // <div className="ml-6 flex-1">
                //     <h2 className="text-lg font-bold text-gray-800 mb-3">Tiêu chí đánh giá</h2>
                //     <ul className="space-y-2">
                //         {criteria.map((criterion, index) => {
                //             const matchedCriteria = criteriaName.find(c => c.id === criterion.criteria.id);
                //             return (
                //                 <li key={index} className="flex justify-between items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                //                     <span className="font-medium">{matchedCriteria ? matchedCriteria.name : "Tiêu chí"}</span>
                //                     <span className="text-yellow-500 font-semibold">{criterion.point?.toFixed(1)} ⭐</span>
                //                 </li>
                //             );
                //         })}
                //     </ul>
                // </div>
                <div className="ml-6 flex-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Tiêu chí đánh giá</h2>
                    <ul className="space-y-2">
                        {criteria.map((criterion, index) => {
                            // Xác định ID tiêu chí (có thể là criteriaId hoặc criteria.id)
                            const criteriaId = criterion.criteriaId || criterion.criteria?.id;
                            const matchedCriteria = criteriaName.find(c => c.id === criteriaId);

                            return (
                                <li key={index} className="flex justify-between items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                                    <span className="font-medium">
                                        {matchedCriteria ? matchedCriteria.name : "Tiêu chí"}
                                    </span>

                                    {/* Hiển thị point hoặc star nếu có */}
                                    {criterion.point !== undefined && (
                                        <span className="text-yellow-500 font-semibold">
                                            {criterion.point.toFixed(1)} ⭐
                                        </span>
                                    )}
                                    {criterion.star !== undefined && (
                                        <span className="text-yellow-500 font-semibold">
                                            {criterion.star} ⭐
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    {isAverage == "false" && (
                        <div className="mt-3">
                            <h3 className="font-semibold">Nội dung</h3>
                            <textarea type="text" readOnly className="border w-full rounded mt-3 p-3" >{text}</textarea>
                        </div>
                    )}

                </div>


            )}
        </div>
    );
};

export default DriverRating;
