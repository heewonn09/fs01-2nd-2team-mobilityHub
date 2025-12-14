package com.iot2ndproject.mobilityhub.domain.image.dao;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.image.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ImageDAOImpl implements ImageDAO{
    private final ImageRepository imageRepository;
    @Override
    public ImageEntity save(ImageEntity image) {
        return imageRepository.save(image);
    }

    @Override
    public ImageEntity findById(Long imageId) {
        return imageRepository.findById((imageId))
                .orElseThrow(() -> new IllegalArgumentException("이미지 없음"));
    }

    @Override
    public ImageEntity findLatest() {
        return null;
    }
}
