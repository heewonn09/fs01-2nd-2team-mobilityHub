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
     * 📸 카메라 → OCR 인식 결과 수신
     */
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        // 1️⃣ Image 저장
        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        imageDAO.save(image);

        // 2️⃣ 입차 기록 생성
        WorkInfoEntity work = new WorkInfoEntity();
        work.setImage(image);
        work.setCarState("WAIT");

        workInfoDAO.save(work);

        return toResponse(work, image);
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
     * ✅ 입차 승인
     */
    @Override
    public void approveEntrance(Long workId) {
        WorkInfoEntity work = workInfoDAO.findById(workId);
        work.setCarState("APPROVED");
        workInfoDAO.save(work);
    }

    /**
     * 🆕 최근 인식 번호판 조회
     */
    @Override
    public EntranceResponseDTO getLatestEntrance() {

        WorkInfoEntity work = workInfoDAO.findLatestWithImage();
        ImageEntity image = work.getImage();

        return toResponse(work, image);
    }

    /**
     * 🔁 Entity → DTO 변환 (🔥 핵심 로직)
     */
    private EntranceResponseDTO toResponse(WorkInfoEntity work, ImageEntity image) {

        EntranceResponseDTO dto = new EntranceResponseDTO();

        dto.setWorkId(work.getId());
        dto.setImageId((long) image.getImageId());

        String ocrNumber = image.getOcrNumber();
        String corrected = image.getCorrectedOcrNumber();

        // 등록된 차량 번호
        String registeredCarNumber = null;
        if (work.getUserCar() != null && work.getUserCar().getCar() != null) {
            registeredCarNumber = work.getUserCar().getCar().getCarNumber();
        }

        // 실제 비교 대상 번호
        String detectedNumber = corrected != null ? corrected : ocrNumber;

        dto.setOcrNumber(ocrNumber);
        dto.setCorrectedOcrNumber(corrected);
        dto.setRegisteredCarNumber(registeredCarNumber);
        dto.setCarNumber(detectedNumber);

        // 🔥 match 판단
        dto.setMatch(
                registeredCarNumber != null &&
                        detectedNumber != null &&
                        registeredCarNumber.equals(detectedNumber)
        );

        dto.setImagePath(image.getImagePath());
        dto.setCameraId(image.getCameraId());
        dto.setTime(image.getRegDate());
        dto.setCarState(work.getCarState());

        return dto;
    }
}
