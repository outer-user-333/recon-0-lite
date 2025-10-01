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
    private String out_of_scope;

    public static ProgramDetailDto fromProgram(Program program) {
        ProgramDetailDto dto = new ProgramDetailDto();
        // Set fields from parent DTO
        dto.setId(program.getId());
        dto.setOrganization_id(program.getOrganization_id().getId());
        //dto.setOrgName(program.getOrganization().getName());
        dto.setTitle(program.getTitle());
        dto.setMin_bounty(program.getMin_bounty());
        dto.setMax_bounty(program.getMax_bounty());
        dto.setTags(program.getTags());
       // dto.setOrgLogoUrl(program.getOrganization().getLogoUrl());

        // Set detail fields
        dto.setDescription(program.getDescription());
        dto.setPolicy(program.getPolicy());
        dto.setScope(program.getScope());
        dto.setOut_of_scope(program.getOut_of_scope());
        return dto;
    }
}