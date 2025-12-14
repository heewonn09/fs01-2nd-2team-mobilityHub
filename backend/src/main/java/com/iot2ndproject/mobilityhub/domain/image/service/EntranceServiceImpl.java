package com.iot2ndproject.mobilityhub.domain.image.service;

import com.iot2ndproject.mobilityhub.domain.image.dao.ImageDAO;
import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final ImageDAO imageDAO;
    private final WorkInfoRepository workInfoRepository;

    /**
     * 📸 OCR 수신 (이미지만 저장)
     */
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        imageDAO.save(image);

        return toResponse(image, null);
    }

    /**
     * ✏️ OCR 번호 수정
     */
    @Override
    public void updateOcrNumber(Long imageId, String carNumber) {
        ImageEntity image = imageDAO.findById(imageId);
        image.setCorrectedOcrNumber(carNumber);
        imageDAO.save(image);
    }

    /**
     * 🆕 최근 인식 번호판 조회 (🔥 핵심 수정)
     */
    @Override
    public EntranceResponseDTO getLatestEntrance() {

        EntranceEntryView view = workInfoRepository
                .findTopByImageIsNotNullOrderByRequestTimeDesc()
                .orElse(null);

        if (view == null) {
            return null;
        }

        EntranceResponseDTO dto = new EntranceResponseDTO();
        dto.setWorkId(view.getId());
        dto.setCarNumber(view.getUserCar_Car_CarNumber());
        dto.setImagePath(view.getImage_ImagePath());

        dto.setCameraId(
                view.getImage_CameraId() != null
                        ? view.getImage_CameraId().toString()
                        : null
        );

        dto.setTime(view.getEntryTime());
        dto.setMatch(false);


        return dto;
    }


    /**
     * 🔁 Image → DTO
     */
    private EntranceResponseDTO toResponse(ImageEntity image, String registeredCarNumber) {

        EntranceResponseDTO dto = new EntranceResponseDTO();
        dto.setImageId((long) image.getImageId());
        dto.setImagePath(image.getImagePath());
        dto.setCameraId(image.getCameraId());
        dto.setOcrNumber(image.getOcrNumber());
        dto.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
        dto.setTime(image.getRegDate());
        dto.setMatch(false);

        return dto;
    }
}
