package com.example.Recon0.services;

import com.example.Recon0.dto.ProgramDto;
import com.example.Recon0.dto.organization.CreateProgramRequest;
import com.example.Recon0.dto.organization.OrgDashboardDto;
import com.example.Recon0.dto.reports.ReportDto;
import com.example.Recon0.models.Organization;
import com.example.Recon0.models.Program;
import com.example.Recon0.models.Report;
import com.example.Recon0.models.User;
import com.example.Recon0.repositories.OrganizationRepository;
import com.example.Recon0.repositories.ProgramRepository;
import com.example.Recon0.repositories.ReportRepository;
import com.example.Recon0.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final ProgramRepository programRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository, ProgramRepository programRepository, ReportRepository reportRepository, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.programRepository = programRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    private Organization getCurrentUsersOrganization() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Assuming a user is linked to one primary organization
        return organizationRepository.findByOwnerId(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("The current user is not associated with any organization."));
    }

    @Transactional(readOnly = true)
    public OrgDashboardDto getDashboard() {
        // In a real app, you'd query this based on the current user's organization
        List<ReportDto> recentReports = reportRepository.findAll().stream()
                .limit(5) // Mocked logic
                .map(ReportDto::fromReport)
                .collect(Collectors.toList());

        return OrgDashboardDto.builder()
                .kpis(Map.of("programCount", 3, "totalReports", 45, "newReports", 12)) // Mocked data
                .recentReports(recentReports)
                .build();
    }

    @Transactional
    public ProgramDto createProgram(CreateProgramRequest request) {
        User currentUser = getCurrentUser();
        Organization org = organizationRepository.findByOwnerId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Organization not found for current user"));

        Program program = new Program();
        program.setOrganization(org);
        program.setTitle(request.getTitle());
        program.setDescription(request.getDescription());
        program.setPolicy(request.getPolicy());
        program.setScope(request.getScope());
        program.setOutOfScope(request.getOutOfScope());
        program.setMinBounty(request.getMinBounty());
        program.setMaxBounty(request.getMaxBounty());
        program.setTags(request.getTags());

        Program savedProgram = programRepository.save(program);
        return ProgramDto.fromProgram(savedProgram);
    }

    @Transactional(readOnly = true)
    public List<ProgramDto> getMyPrograms() {
        Organization organization = getCurrentUsersOrganization();
        List<Program> programs = programRepository.findByOrganization(organization);

        return programs.stream()
                .map(ProgramDto::fromProgram) // Use the DTO conversion helper
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto updateReportStatus(UUID reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Add authorization logic to ensure user's org owns the report's program

        report.setStatus(status);
        Report updatedReport = reportRepository.save(report);
        return ReportDto.fromReport(updatedReport);
    }
}
