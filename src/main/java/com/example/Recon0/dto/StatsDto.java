package com.example.Recon0.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private int reputation_points;
    private int reports_submitted;
    private int reports_accepted;
    private int bounties_earned;
}
