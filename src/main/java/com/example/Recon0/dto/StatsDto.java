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
    private int reputationPoints;
    private int reportsSubmitted;
    private int reportsAccepted;
    private int bountiesEarned;
}
