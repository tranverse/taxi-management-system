import axiosInstance, { service } from "@tools/axios.tool"
import { getApiUrl, getAuthUrl } from "@tools/url.tool"
const DriverService = {
    getAllDriversFree() {
        return service(axiosInstance.get(getApiUrl("/driver/all-driver-free")))
    },
    getDriverInfo(){
        return service(axiosInstance.get(getAuthUrl("/info-user")))
    },
    updateLocation(driverId, data){
        return service(axiosInstance.put(getApiUrl(`/driver/update-location/${driverId}`), data))
    },
    getAllDriverBookings(driverId){
        return service(axiosInstance.get(getApiUrl(`/booking/all-user/${driverId}`)))
    },
    getDriverDetail(driverId){
        return service(axiosInstance.get(getApiUrl(`/driver/detail/${driverId}`)))
    },
    getAllDriversBusy() {
        return service(axiosInstance.get(getApiUrl("/driver/all-driver-busy")))
    },
    getAllDriversInactive() {
        return service(axiosInstance.get(getApiUrl("/driver/all-driver-inactive")))
    },
    getAllDriversOff() {
        return service(axiosInstance.get(getApiUrl("/driver/all-driver-off")))
    },
    getAllDriversFreeByVehicleType(vehicleTypeId) {
        return service(axiosInstance.get(getApiUrl("/driver/all-driver-free/"+vehicleTypeId)))
    },
}

export default DriverService 