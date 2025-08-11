package com.gis.service;

import com.gis.dto.car.CarCreateRequest;
import com.gis.dto.car.CarResponse;
import com.gis.exception.AppException;
import com.gis.mapper.CarMapper;
import com.gis.model.Car;
import com.gis.model.VehicleType;
import com.gis.repository.CarRepository;
import com.gis.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarService {
    private final CarRepository carRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final CarMapper carMapper;

    public CarResponse createCar(CarCreateRequest request){
        VehicleType vehicleType = vehicleTypeRepository.findById(request.getVehicleType().getId()).orElseThrow(()
                -> new AppException(HttpStatus.NOT_FOUND, "Vehicle type not found", "vehicle-type-e-01"));
        Car car = Car.builder()
                .licensePlate(request.getLicensePlate())
                .image(request.getImage())
                .description(request.getDescription())
                .vehicleType(vehicleType)
                .status(true)
                .build();
        carRepository.save(car);
        return carMapper.carToCarResponse(car);
    }
}
