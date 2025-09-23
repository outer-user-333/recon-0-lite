package com.example.Recon0.dto.organization;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UpdateReportStatusRequest {
    @NotEmpty
    private String status;
}
