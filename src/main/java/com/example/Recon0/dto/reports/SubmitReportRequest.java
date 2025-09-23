package com.example.Recon0.dto.reports;

import lombok.Data;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

@Data
public class SubmitReportRequest {
    @NotEmpty
    private UUID programId;
    @NotEmpty
    private String title;
    @NotEmpty
    private String severity;
    @NotEmpty
    private String description;
    @NotEmpty
    private String stepsToReproduce;
    @NotEmpty
    private String impact;
    private List<AttachmentDto> attachments;
}
