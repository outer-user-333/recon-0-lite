package com.example.Recon0.repositories;

//import com.example.Recon0.models.Organization;
import com.example.Recon0.models.Program;
import com.example.Recon0.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProgramRepository extends JpaRepository<Program, UUID> {
    @Query("SELECT p FROM Program p WHERE p.organization_id = :organization")
    List<Program> findByOrganization(@Param("organization") User organization);

}
