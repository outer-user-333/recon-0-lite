package com.example.Recon0.dto;

import com.example.Recon0.models.Program;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProgramDetailDto extends ProgramDto {
    private String description;
    private String policy;
    private String scope;
    private String outOfScope;

    public static ProgramDetailDto fromProgram(Program program) {
        ProgramDetailDto dto = new ProgramDetailDto();
        // Set fields from parent DTO
        dto.setId(program.getId());
        dto.setOrganizationId(program.getOrganization().getId());
        dto.setOrgName(program.getOrganization().getName());
        dto.setTitle(program.getTitle());
        dto.setMinBounty(program.getMinBounty());
        dto.setMaxBounty(program.getMaxBounty());
        dto.setTags(program.getTags());
        dto.setOrgLogoUrl(program.getOrganization().getLogoUrl());

        // Set detail fields
        dto.setDescription(program.getDescription());
        dto.setPolicy(program.getPolicy());
        dto.setScope(program.getScope());
        dto.setOutOfScope(program.getOutOfScope());
        return dto;
    }
}