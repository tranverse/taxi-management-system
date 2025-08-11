package com.gis.mapper;

import com.gis.dto.vehicleType.VehicleTypeResponse;
import com.gis.model.VehicleType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VehicleTypeMapper {
    VehicleTypeResponse vehicleTypeResponse(VehicleType vehicleType);

    @Mapping(source = "seat", target = "seat")
    List<VehicleTypeResponse> vehicleTypeResponses(List<VehicleType> vehicleTypes);
}
