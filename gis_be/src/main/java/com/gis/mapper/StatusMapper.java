package com.gis.mapper;

import com.gis.dto.status.StatusResponse;
import com.gis.model.Status;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StatusMapper {
    StatusResponse toStatusResponse(Status status);
}
