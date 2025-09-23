package com.example.Recon0.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileUploadResponse {
    private boolean success;
    private String message;
    private String secure_url; // For avatar/logo
    private String url; // For attachments
    private String name;
    private String type;
}

