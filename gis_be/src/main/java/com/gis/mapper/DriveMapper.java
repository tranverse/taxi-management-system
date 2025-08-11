package com.gis.mapper;

import com.gis.dto.drive.DriveResponse;
import com.gis.model.Drive;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DriveMapper {
    DriveResponse toDriveResponse(Drive drive);
}
