import React from "react";
import apiCode from "@configs/apiCode.config";
export default function useMessageByApiCode(){
    return function(key){
        return apiCode[key]
    }
}