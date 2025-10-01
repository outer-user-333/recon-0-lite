package com.example.Recon0.dto.reports;

import com.example.Recon0.models.Report;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class ReportDto {
    private UUID id;
    private String program_name;
    private String title;
    private String severity;
    private String status;
    private OffsetDateTime created_at;

    public static ReportDto fromReport(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setProgram_name(report.getProgram().getTitle());
        dto.setTitle(report.getTitle());
        dto.setSeverity(report.getSeverity());
        dto.setStatus(report.getStatus());
        dto.setCreated_at(report.getCreated_at());
        return dto;
    }
}
