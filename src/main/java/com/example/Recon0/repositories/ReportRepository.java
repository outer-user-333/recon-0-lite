package com.example.Recon0.repositories;

import com.example.Recon0.models.Report;

import com.example.Recon0.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    long countByReporter(User reporter);
    long countByReporterAndStatus(User reporterId, String status);


    List<Report> findByReporter(User reporter);

    /**
     * Calculates the sum of minimum bounties for all accepted reports by a specific user.
     * This is an approximation of total earnings. A real-world scenario might have a
     * dedicated 'bountyAwarded' field on the Report entity.
     * @param reporterId The ID of the user (reporter).
     * @return The sum of bounties, or null if there are no accepted reports.
     */
    @Query("SELECT SUM(p.min_bounty) FROM Report r JOIN r.program p WHERE r.reporter.id = :reporterId AND r.status = 'Accepted'")
    Integer sumBountiesForAcceptedReports(@Param("reporterId") UUID reporterId);

}
