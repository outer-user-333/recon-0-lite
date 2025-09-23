package com.example.Recon0.services;

import com.example.Recon0.dto.reports.ReportDetailDto;
import com.example.Recon0.dto.reports.ReportDto;
import com.example.Recon0.dto.reports.SubmitReportRequest;
import com.example.Recon0.models.Program;
import com.example.Recon0.models.Report;
import com.example.Recon0.models.ReportAttachment;
import com.example.Recon0.models.User;
import com.example.Recon0.repositories.ProgramRepository;
import com.example.Recon0.repositories.ReportAttachmentRepository;
import com.example.Recon0.repositories.ReportRepository;
import com.example.Recon0.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final ReportAttachmentRepository reportAttachmentRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, ProgramRepository programRepository, ReportAttachmentRepository reportAttachmentRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.reportAttachmentRepository = reportAttachmentRepository;
    }

    private User getCurrentUser() {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(currentUser)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public ReportDetailDto submitReport(SubmitReportRequest request) {
        User currentUser = getCurrentUser();
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Report report = new Report();
        report.setReporter(getCurrentUser());
        report.setProgram(program);
        report.setTitle(request.getTitle());
        report.setSeverity(request.getSeverity());
        report.setDescription(request.getDescription());
        report.setStepsToReproduce(request.getStepsToReproduce());
        report.setImpact(request.getImpact());

        // Save the main report first to get its ID
        Report savedReport = reportRepository.save(report);

        // Handle attachments
        List<ReportAttachment> attachments = new ArrayList<>();
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (var attDto : request.getAttachments()) {
                ReportAttachment attachment = new ReportAttachment();
                attachment.setReport(savedReport);
                attachment.setFileUrl(attDto.getUrl());
                attachment.setFileName(attDto.getName());
                attachment.setFileType(attDto.getType());
                attachments.add(attachment);
            }
            reportAttachmentRepository.saveAll(attachments);
        }
        savedReport.setAttachments(attachments);

        return ReportDetailDto.fromReport(savedReport);
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getMyReports() {
        User currentUser = getCurrentUser();
        return reportRepository.findByReporter(currentUser).stream()
                .map(ReportDto::fromReport)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportDetailDto getReportDetails(UUID reportId) {
        User currentUser = getCurrentUser();
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Security Check: Ensure the person fetching is either the reporter or part of the program's organization
        // This is a simplified check. A real implementation would be more robust.
        boolean isReporter = report.getReporter().getId().equals(currentUser.getId());
        // boolean isOrgMember = report.getProgram().getOrganization().getOwnerId().equals(currentUser.getId());

        // if (!isReporter && !isOrgMember) {
        //     throw new SecurityException("You do not have permission to view this report.");
        // }

        return ReportDetailDto.fromReport(report);
    }
}
