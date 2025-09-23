package com.example.Recon0.dto.community;

import com.example.Recon0.models.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private UUID id;
    private String userId;
    private String type;
    private String message;
    private boolean isRead;
    private String createdAt;

    public static NotificationDto fromNotification(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getUser().getId().toString(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt().toString()
        );
    }
}
