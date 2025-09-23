package com.example.Recon0.models;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "program_id")
    private UUID programId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", insertable = false, updatable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)   // <-- Important
    @JoinColumn(name = "reporter_id")
    private User reporter;

    private String title;
    private String severity;
    private String status;
    private String description;

    @Column(name = "steps_to_reproduce")
    private String stepsToReproduce;

    private String impact;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    /**
     * Represents the one-to-many relationship between a report and its attachments.
     * - mappedBy = "report": Indicates that the 'report' field in the ReportAttachment entity owns this relationship.
     * - cascade = CascadeType.ALL: Operations (like save, delete) on a Report will cascade to its attachments.
     * - orphanRemoval = true: If an attachment is removed from this list, it will be deleted from the database.
     */
    @OneToMany(
            mappedBy = "report",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<ReportAttachment> attachments = new ArrayList<>();
}