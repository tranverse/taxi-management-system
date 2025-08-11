package com.gis.mapper;

import com.gis.dto.car.CarResponse;
import com.gis.model.Car;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CarMapper {
    CarResponse carToCarResponse(Car car);
}
