package com.example.Recon0.repositories;

import com.example.Recon0.models.Organization;
import com.example.Recon0.models.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProgramRepository extends JpaRepository<Program, UUID> {
    List<Program> findByOrganization(Organization organization);
}
