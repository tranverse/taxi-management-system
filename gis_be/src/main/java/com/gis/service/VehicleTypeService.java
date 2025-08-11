package com.gis.service;

import com.gis.dto.vehicleType.VehicleTypeResponse;
import com.gis.mapper.VehicleTypeMapper;
import com.gis.model.VehicleType;
import com.gis.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleTypeService {
    private final VehicleTypeRepository vehicleTypeRepository;
    private final VehicleTypeMapper vehicleTypeMapper;

    public List<VehicleTypeResponse> getAllVehicleTypes() {
        List<VehicleType> vehicleTypes = vehicleTypeRepository.findAll();
        return vehicleTypeMapper.vehicleTypeResponses(vehicleTypes);
    }
}
