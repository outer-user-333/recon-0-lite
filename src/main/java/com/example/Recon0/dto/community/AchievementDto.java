package com.example.Recon0.dto.community;

import com.example.Recon0.models.Achievement;
import lombok.Data;

@Data
public class AchievementDto {
    private String id;
    private String name;
    private String description;
    private String icon;

    public static AchievementDto fromAchievement(Achievement achievement) {
        AchievementDto dto = new AchievementDto();
        dto.setId(achievement.getId());
        dto.setName(achievement.getName());
        dto.setDescription(achievement.getDescription());
        dto.setIcon(achievement.getIcon());
        return dto;
    }
}
