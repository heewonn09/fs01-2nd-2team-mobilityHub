package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairReportRepository extends JpaRepository<ReportEntity, String> {

    ReportEntity findByReportId(String reportId);

    void deleteByReportId(String reportId);
}
