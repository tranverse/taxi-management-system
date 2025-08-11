package com.gis.mapper;

import com.gis.dto.criteria.CriteriaResponse;
import com.gis.model.Criteria;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CriteriaMapper {
    List<CriteriaResponse> toCriteriaResponseList(List<Criteria> criterias);
}
