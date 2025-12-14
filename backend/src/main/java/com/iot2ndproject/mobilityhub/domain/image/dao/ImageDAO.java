package com.iot2ndproject.mobilityhub.domain.image.dao;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;

public interface ImageDAO {
    ImageEntity save(ImageEntity image);

    ImageEntity findById(Long imageId);

    ImageEntity findLatest();
}
