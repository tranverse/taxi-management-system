package com.gis.mapper;

import com.gis.dto.customer.CustomerResponse;
import com.gis.dto.jwt.JWTPayloadDto;
import com.gis.dto.type.TypeResponse;
import com.gis.enums.ERole;
import com.gis.model.Customer;
import com.gis.model.Type;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(source = "role", target = "scope", qualifiedByName = "roleToScope")
    JWTPayloadDto toJWTPayloadDto(Customer customer);

    @org.mapstruct.Named("roleToScope")
    static String roleToScope(ERole role) {
        return String.format("ROLE_%s", role.name());
    }

    @Mapping(source = "type", target = "type", qualifiedByName = "mapTypeToTypeResponse")
    CustomerResponse toCustomerResponse(Customer customer);

    @org.mapstruct.Named("mapTypeToTypeResponse")
    static TypeResponse mapTypeToTypeResponse(Type type) {
        return type == null ? null : new TypeResponse(type.getId(), type.getName(), type.getReducedRate(), type.getPoint());
    }

}
