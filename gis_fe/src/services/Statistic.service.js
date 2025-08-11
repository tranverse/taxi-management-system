import axiosInstance, { service } from "@tools/axios.tool";
import { getApiUrl } from "@tools/url.tool";
import React from "react";

const StatisticService = {
    getRevenueByDriver(driverId){
        return service(axiosInstance.get(getApiUrl(`/statistic/revenue-by-driver/${driverId}`)))
    }
}
 
export default StatisticService