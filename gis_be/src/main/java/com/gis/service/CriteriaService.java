package com.gis.service;

import com.gis.dto.criteria.CriteriaResponse;
import com.gis.mapper.CriteriaMapper;
import com.gis.model.Criteria;
import com.gis.repository.CriteriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class CriteriaService {
    private final CriteriaRepository criteriaRepository;
    private final CriteriaMapper criteriaMapper;

    public List<CriteriaResponse> getAllCriteria(){
        List<Criteria> criteria = criteriaRepository.findAll();
        return criteriaMapper.toCriteriaResponseList(criteria);
    }
}
