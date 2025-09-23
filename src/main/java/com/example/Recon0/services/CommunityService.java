package com.example.Recon0.services;

import com.example.Recon0.dto.community.AchievementDto;
import com.example.Recon0.dto.community.LeaderboardEntryDto;
import com.example.Recon0.models.User;
import com.example.Recon0.models.UserAchievement;
import com.example.Recon0.repositories.AchievementRepository;
import com.example.Recon0.repositories.UserAchievementRepository;
import com.example.Recon0.repositories.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
@Service
public class CommunityService {


    private final UserRepository userRepository;


    private  final AchievementRepository achievementRepository;

    private final UserAchievementRepository userAchievementRepository;

    public CommunityService(UserAchievementRepository userAchievementRepository, AchievementRepository achievementRepository, UserRepository userRepository) {
        this.userAchievementRepository = userAchievementRepository;
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }


    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard() {
        // Fetch top 10 users by reputation points
        List<User> topUsers = userRepository.findAll(
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "reputationPoints"))
        ).getContent();

        AtomicInteger rank = new AtomicInteger(1);
        return topUsers.stream()
                .map(user -> new LeaderboardEntryDto(
                        rank.getAndIncrement(),
                        user.getUsername(),
                        user.getReputationPoints()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AchievementDto> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(AchievementDto::fromAchievement)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getMyAchievements() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserId(currentUser.getId());

        return userAchievements.stream()
                .map(ua -> ua.getAchievement().getId())
                .collect(Collectors.toList());
    }
}
