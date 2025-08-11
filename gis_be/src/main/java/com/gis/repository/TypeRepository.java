package com.gis.repository;

import com.gis.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeRepository extends JpaRepository<Type, String> {
    Type findByName(String name);
}
