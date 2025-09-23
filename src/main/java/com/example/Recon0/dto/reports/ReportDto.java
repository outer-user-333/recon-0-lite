package com.example.Recon0.dto.reports;

import com.example.Recon0.models.Report;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class ReportDto {
    private UUID id;
    private String programName;
    private String title;
    private String severity;
    private String status;
    private OffsetDateTime createdAt;

    public static ReportDto fromReport(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setProgramName(report.getProgram().getTitle());
        dto.setTitle(report.getTitle());
        dto.setSeverity(report.getSeverity());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
