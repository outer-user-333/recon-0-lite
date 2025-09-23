package com.example.Recon0.services;

import com.example.Recon0.dto.community.NotificationDto;
import com.example.Recon0.models.Notification;
import com.example.Recon0.models.User;
import com.example.Recon0.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Retrieves all notifications for the currently authenticated user.
     *
     * @return A list of NotificationDto objects.
     */
    @Transactional(readOnly = true)
    public List<NotificationDto> getNotificationsForCurrentUser() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(currentUser);
        return notifications.stream()
                .map(NotificationDto::fromNotification)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new notification for a specific user. This is a helper method
     * that can be called from other services when an event occurs.
     * For example, when a report status is updated.
     *
     * @param user    The user who will receive the notification.
     * @param type    The type of notification (e.g., 'report_update').
     * @param message The notification message.
     */
    @Transactional
    public void createNotification(User user, String type, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
