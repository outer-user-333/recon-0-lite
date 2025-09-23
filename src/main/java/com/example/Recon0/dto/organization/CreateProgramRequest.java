package com.example.Recon0.dto.organization;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProgramRequest {
    @NotEmpty
    private String title;
    @NotEmpty
    private String description;
    @NotEmpty
    private String policy;
    @NotEmpty
    private String scope;
    private String outOfScope;
    @NotNull
    private Integer minBounty;
    @NotNull
    private Integer maxBounty;
    private String[] tags;
}

