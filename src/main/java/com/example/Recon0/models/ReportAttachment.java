package com.example.Recon0.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_attachments")
@Data
public class ReportAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    private String fileUrl;
    private String fileName;
    private String fileType;

    @CreationTimestamp
    private OffsetDateTime uploadedAt;
}

