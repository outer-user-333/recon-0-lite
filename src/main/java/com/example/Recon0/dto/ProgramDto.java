package com.example.Recon0.dto;

import com.example.Recon0.models.Program;
import lombok.Data;
import java.util.UUID;

@Data
public class ProgramDto {
    private UUID id;
    private UUID organization_id;
    private String org_name;
    private String title;
    private Integer min_bounty;
    private Integer max_bounty;
    private String[] tags;
    private String org_logo_url;

    public static ProgramDto fromProgram(Program program) {
        ProgramDto dto = new ProgramDto();
        dto.setId(program.getId());
        dto.setOrganization_id(program.getOrganization_id().getId());
        dto.setOrg_name(program.getOrganization_id().getFull_name());
        dto.setTitle(program.getTitle());
        dto.setMin_bounty(program.getMin_bounty());
        dto.setMax_bounty(program.getMax_bounty());
        dto.setTags(program.getTags());
        //dto.setOrgLogoUrl(program.getOrganization().getLogoUrl());
        return dto;
    }
}
