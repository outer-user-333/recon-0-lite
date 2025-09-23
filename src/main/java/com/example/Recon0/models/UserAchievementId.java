package com.example.Recon0.models;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * This class represents the composite primary key for the UserAchievement entity.
 * It must implement Serializable and have equals() and hashCode() methods.
 */
public class UserAchievementId implements Serializable {
    private UUID user; // Corresponds to the 'user' field in UserAchievement
    private String achievement; // Corresponds to the 'achievement' field in UserAchievement

    public UserAchievementId() {
    }

    public UserAchievementId(UUID user, String achievement) {
        this.user = user;
        this.achievement = achievement;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserAchievementId that = (UserAchievementId) o;
        return Objects.equals(user, that.user) && Objects.equals(achievement, that.achievement);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, achievement);
    }
}

