import axiosInstance, { service } from "@tools/axios.tool"
import { getApiUrl, getAuthUrl } from "@tools/url.tool"
const BookingService = {
    bookCar(data){
        return service(axiosInstance.post(getApiUrl("/booking/booking"), data))
    },
    calculatePrice(kilometer, vehicleType){
        return service(axiosInstance.post(getApiUrl("/price/calculate"), {kilometer, vehicleType}))
    },
    updateStatus(data){
        console.log(data)
        return service(axiosInstance.post(getApiUrl("/status/update"), data))
    },
    traceDriver(data){
        return service(axiosInstance.post(getApiUrl("/status/trace"), data))
    },
    getBooking(bookingId){
        return service(axiosInstance.get(getApiUrl(`/booking/detail/${bookingId}`)))
    },
    getStatus(bookingId){
        return service(axiosInstance.get(getApiUrl(`/booking/status/${bookingId}`)))
    },
    getBookingByDriverId(driverId){
        return service(axiosInstance.get(getApiUrl(`/booking/detail-driver/${driverId}`)))
    },
    rejectedBooking(bookingId){
        return service(axiosInstance.put(getApiUrl(`/booking/rejected-booking/${bookingId}`)))
    }
}

export default BookingService