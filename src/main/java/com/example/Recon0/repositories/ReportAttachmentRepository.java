package com.example.Recon0.repositories;

import com.example.Recon0.models.ReportAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportAttachmentRepository extends JpaRepository<ReportAttachment, UUID> {
}
