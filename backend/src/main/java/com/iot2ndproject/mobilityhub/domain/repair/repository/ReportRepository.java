package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, String> {

    // 보고서 아이디 찾기
    ReportEntity findByReportId(String reportId);

    // 보고서 삭제
    void deleteByReportId(String reportId);

    // 차량별 최신 보고서 조회(정비 추가요금 계산용)
    ReportEntity findTopByUserCar_IdOrderByReportIdDesc(Long userCarId);
}
