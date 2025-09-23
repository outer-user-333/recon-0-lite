package com.example.Recon0.dto.organization;

import com.example.Recon0.dto.reports.ReportDto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class OrgDashboardDto {
    private Map<String, Integer> kpis;
    private List<ReportDto> recentReports;
}
