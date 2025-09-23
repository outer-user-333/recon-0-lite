package com.example.Recon0.web;

import com.example.Recon0.dto.ApiResponse;
import com.example.Recon0.dto.reports.ReportDto;
import com.example.Recon0.dto.reports.SubmitReportRequest;
import com.example.Recon0.services.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportDto>> submitReport(@Valid @RequestBody SubmitReportRequest request) {
        // Add @PreAuthorize("hasRole('hacker')") for security
        try {
            ReportDto createdReport = reportService.submitReport(request);
            return new ResponseEntity<>(ApiResponse.success(createdReport), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // The API contract has /my-reports, so we create a separate controller/endpoint for that
    // to avoid ambiguity with /reports/{id}
    @GetMapping("/my-reports")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getMyReports() {
        // Add @PreAuthorize("hasRole('hacker')") for security
        List<ReportDto> reports = reportService.getMyReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
}
