package com.iot2ndproject.mobilityhub.domain.image.service;

import com.iot2ndproject.mobilityhub.domain.image.dao.ImageDAO;
import com.iot2ndproject.mobilityhub.domain.image.dao.WorkInfoDAO;
import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final ImageDAO imageDAO;
    private final WorkInfoDAO workInfoDAO;

    /**
     * 📸 OCR 수신 (Image만 저장)
     */
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        imageDAO.save(image);

        return toResponse(null, image);
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
     * 🆕 최근 인식 번호판 조회
     */
    @Override
    public EntranceResponseDTO getLatestEntrance() {

        WorkInfoEntity work = workInfoDAO.findLatestWithImage();
        ImageEntity image = work != null ? work.getImage() : imageDAO.findLatest();

        return toResponse(work, image);
    }

    /**
     * 🔁 Entity → DTO
     */
    private EntranceResponseDTO toResponse(WorkInfoEntity work, ImageEntity image) {

        EntranceResponseDTO dto = new EntranceResponseDTO();

        dto.setImageId((long) image.getImageId());
        dto.setImagePath(image.getImagePath());
        dto.setCameraId(image.getCameraId());
        dto.setOcrNumber(image.getOcrNumber());
        dto.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
        dto.setTime(image.getRegDate());

        if (work != null && work.getUserCar() != null && work.getUserCar().getCar() != null) {
            String registered = work.getUserCar().getCar().getCarNumber();
            String detected = image.getCorrectedOcrNumber() != null
                    ? image.getCorrectedOcrNumber()
                    : image.getOcrNumber();

            dto.setRegisteredCarNumber(registered);
            dto.setMatch(registered.equals(detected));
            dto.setWorkId(work.getId());
        } else {
            dto.setMatch(false);
        }

        return dto;
    }
}
