package com.example.Recon0.dto;

import com.example.Recon0.models.Program;
import lombok.Data;
import java.util.UUID;

@Data
public class ProgramDto {
    private UUID id;
    private UUID organizationId;
    private String orgName;
    private String title;
    private Integer minBounty;
    private Integer maxBounty;
    private String[] tags;
    private String orgLogoUrl;

    public static ProgramDto fromProgram(Program program) {
        ProgramDto dto = new ProgramDto();
        dto.setId(program.getId());
        dto.setOrganizationId(program.getOrganization().getId());
        dto.setOrgName(program.getOrganization().getName());
        dto.setTitle(program.getTitle());
        dto.setMinBounty(program.getMinBounty());
        dto.setMaxBounty(program.getMaxBounty());
        dto.setTags(program.getTags());
        dto.setOrgLogoUrl(program.getOrganization().getLogoUrl());
        return dto;
    }
}
