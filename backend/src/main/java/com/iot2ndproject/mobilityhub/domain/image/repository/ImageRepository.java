package com.iot2ndproject.mobilityhub.domain.image.repository;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

}