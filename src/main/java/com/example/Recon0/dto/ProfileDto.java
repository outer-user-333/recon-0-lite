package com.example.Recon0.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ProfileDto {
    private UUID id;
    private String email;
    private String username;
    private String fullName;
    private String role;
    private String status;
    private Integer reputationPoints;
    private String avatarUrl;
    private String bio;
    private OffsetDateTime createdAt;
}
