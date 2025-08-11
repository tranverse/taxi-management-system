import axiosInstance, { service } from "@tools/axios.tool";
import { getApiUrl } from "@tools/url.tool";
import React from "react";

const ReviewService = {
    getCriteria() {
        return service(axiosInstance.get(getApiUrl("/criteria/all")))
    },
    createReview(data){
        return service(axiosInstance.post(getApiUrl("/review/add"), data))
    },
    getReviewByDriver(driverId){
        return service(axiosInstance.get(getApiUrl(`/review/driver/${driverId}`)))
    },
    getReviewByBookingId(bookingId){
        return service(axiosInstance.get(getApiUrl(`/review/detail/${bookingId}`)))

    }
}

export default ReviewService