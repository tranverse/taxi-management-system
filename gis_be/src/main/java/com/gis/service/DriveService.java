package com.gis.service;

import com.gis.dto.drive.DriveRequest;
import com.gis.dto.drive.DriveResponse;
import com.gis.exception.AppException;
import com.gis.mapper.DriveMapper;
import com.gis.model.Car;
import com.gis.model.Drive;
import com.gis.repository.CarRepository;
import com.gis.repository.DriveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DriveService {
    private final DriveRepository driveRepository;
    private final CarRepository carRepository;
    private final DriveMapper driveMapper;

    public DriveResponse drive(DriveRequest request) {
        Drive drive = Drive.builder()
                .user(request.getUser())
                .car(request.getCar())
                .receiveDate(LocalDateTime.now())
                .returnDate(LocalDateTime.now())
                .build();
        driveRepository.save(drive);
        Car car = carRepository.findById(request.getCar().getId()).orElseThrow(()
            -> new AppException(HttpStatus.NOT_FOUND, "Car not found", "car-e-02"));
        car.setStatus(false);
        carRepository.save(car);
        return driveMapper.toDriveResponse(drive);
    }
}
