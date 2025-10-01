package com.example.Recon0.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(min = 1)
    private String full_name;

    @Size(min = 3)
    private String username;

    private String bio;
}

