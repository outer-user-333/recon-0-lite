package com.example.Recon0.repositories;

import com.example.Recon0.models.Notification;
import com.example.Recon0.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    /**
     * Finds all notifications for a specific user, ordered by creation time in descending order (newest first).
     *
     * @param user The user whose notifications are to be retrieved.
     * @return A list of notifications for the given user.
     */
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}

