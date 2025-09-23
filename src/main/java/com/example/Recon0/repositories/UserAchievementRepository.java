package com.example.Recon0.repositories;

import com.example.Recon0.models.UserAchievement;
import com.example.Recon0.models.UserAchievementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UserAchievementId> {
    List<UserAchievement> findByUserId(UUID userId);
}