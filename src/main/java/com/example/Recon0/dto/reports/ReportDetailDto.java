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
    private UUID program_id;
    private String description;
    private String steps_to_reproduce;
    private String impact;
    private List<AttachmentDetailDto> attachments;

    @Data
    public static class AttachmentDetailDto {
        private UUID id;
        private String file_url;
        private String file_name;
        private String file_type;
        private OffsetDateTime uploaded_at;
    }

    public static ReportDetailDto fromReport(Report report) {
        ReportDetailDto dto = new ReportDetailDto();
        // Base fields
        dto.setId(report.getId());
        dto.setProgram_name(report.getProgram().getTitle());
        dto.setTitle(report.getTitle());
        dto.setSeverity(report.getSeverity());
        dto.setStatus(report.getStatus());
        dto.setCreated_at(report.getCreated_at());
        // Detail fields
        dto.setProgram_id(report.getProgram().getId());
        dto.setDescription(report.getDescription());
        dto.setSteps_to_reproduce(report.getSteps_to_reproduce());
        dto.setImpact(report.getImpact());
        dto.setAttachments(report.getAttachments().stream().map(attachment -> {
            AttachmentDetailDto attDto = new AttachmentDetailDto();
            attDto.setId(attachment.getId());
            attDto.setFile_url(attachment.getFile_url());
            attDto.setFile_name(attachment.getFile_name());
            attDto.setFile_type(attachment.getFile_type());
            attDto.setUploaded_at(attachment.getUploaded_at());
            return attDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
