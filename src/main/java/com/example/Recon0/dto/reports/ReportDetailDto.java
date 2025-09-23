package com.example.Recon0.dto.reports;

import com.example.Recon0.models.Report;
import com.example.Recon0.models.ReportAttachment;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReportDetailDto extends ReportDto {
    private UUID programId;
    private String description;
    private String stepsToReproduce;
    private String impact;
    private List<AttachmentDetailDto> attachments;

    @Data
    public static class AttachmentDetailDto {
        private UUID id;
        private String fileUrl;
        private String fileName;
        private String fileType;
        private OffsetDateTime uploadedAt;
    }

    public static ReportDetailDto fromReport(Report report) {
        ReportDetailDto dto = new ReportDetailDto();
        // Base fields
        dto.setId(report.getId());
        dto.setProgramName(report.getProgram().getTitle());
        dto.setTitle(report.getTitle());
        dto.setSeverity(report.getSeverity());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        // Detail fields
        dto.setProgramId(report.getProgram().getId());
        dto.setDescription(report.getDescription());
        dto.setStepsToReproduce(report.getStepsToReproduce());
        dto.setImpact(report.getImpact());
        dto.setAttachments(report.getAttachments().stream().map(attachment -> {
            AttachmentDetailDto attDto = new AttachmentDetailDto();
            attDto.setId(attachment.getId());
            attDto.setFileUrl(attachment.getFileUrl());
            attDto.setFileName(attachment.getFileName());
            attDto.setFileType(attachment.getFileType());
            attDto.setUploadedAt(attachment.getUploadedAt());
            return attDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
