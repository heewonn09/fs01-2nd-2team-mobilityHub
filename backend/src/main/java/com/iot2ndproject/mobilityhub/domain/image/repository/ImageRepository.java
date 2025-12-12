package com.iot2ndproject.mobilityhub.domain.image.repository;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEntity, Integer> {

}
