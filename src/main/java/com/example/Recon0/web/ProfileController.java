package com.example.Recon0.web;

import com.example.Recon0.dto.ApiResponse;
import com.example.Recon0.dto.ProfileDto;
import com.example.Recon0.dto.StatsDto;
import com.example.Recon0.dto.UpdateProfileRequest;
import com.example.Recon0.services.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getCurrentUserProfile() {
        ProfileDto profile = profileService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> updateCurrentUserProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            ProfileDto updatedProfile = profileService.updateCurrentUserProfile(request);
            return ResponseEntity.ok(ApiResponse.success(updatedProfile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsDto>> getUserStats() {
        StatsDto stats = profileService.getUserStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

