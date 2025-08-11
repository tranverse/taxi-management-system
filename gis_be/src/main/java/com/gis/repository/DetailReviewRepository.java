package com.gis.repository;

import com.gis.model.Criteria;
import com.gis.model.DetailReview;
import com.gis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface DetailReviewRepository extends JpaRepository<DetailReview, String> {
    @Query("SELECT COALESCE(SUM(d.point), 0) FROM DetailReview d WHERE d.criteria.id = :criteriaId")
    Double getTotalPoints(@Param("criteriaId") String criteriaId);

    @Query("SELECT COUNT(d) FROM DetailReview d WHERE d.criteria.id = :criteriaId")
    Long getReviewCount(@Param("criteriaId") String criteriaId);

    List<DetailReview> findByCriteriaAndUser(Criteria criteria, User user);

    List<DetailReview> findAllByUserId(String userId);
}
