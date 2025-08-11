import axiosInstance, { service } from "@tools/axios.tool";
import { getApiUrl } from "@tools/url.tool";
import React from "react";

const VehicleTypeService = {
    getAllVehicleType(){
        return service(axiosInstance.get(getApiUrl("/vehicle-type/all")))
    }
}
 
export default VehicleTypeService