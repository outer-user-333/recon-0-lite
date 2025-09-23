package com.example.Recon0.repositories;

import com.example.Recon0.models.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    Optional<Organization> findByOwnerId(UUID ownerId);

}
