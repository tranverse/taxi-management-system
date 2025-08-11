import axiosInstance, { service } from "@tools/axios.tool";
import { getApiUrl, getAuthUrl } from "@tools/url.tool";
import React from "react";

const CustomerService = {
    info(){
        return (service(axiosInstance.get(getAuthUrl("/info-customer"))))
    },
    getAllCustomerBookings(customerId){
        return service(axiosInstance.get(getApiUrl(`/booking/all-customer/${customerId}`)))
    }
}

export default CustomerService