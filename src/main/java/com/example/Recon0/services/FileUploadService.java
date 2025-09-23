package com.example.Recon0.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.Recon0.dto.FileUploadResponse;
import com.example.Recon0.models.Organization;
import com.example.Recon0.models.User;
import com.example.Recon0.repositories.OrganizationRepository;
import com.example.Recon0.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//import java.io.IOException;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadService {
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public FileUploadService(UserRepository userRepository,OrganizationRepository organizationRepository,Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.organizationRepository =  organizationRepository;
        this.cloudinary=cloudinary;

    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // In a real application, you would inject a Cloudinary/S3 client here.
    @Transactional
    public FileUploadResponse uploadFile(MultipartFile file, String fileType) throws IOException {
        // Mock implementation
        switch (fileType) {
            case "avatar":
                return uploadAvatar(file, getCurrentUser());
            case "logo":
                return uploadOrganizationLogo(file, getCurrentUser());
            case "attachment":
                return uploadGenericAttachment(file);
            default:
                throw new IllegalArgumentException("Invalid file type specified: " + fileType);
        }
    }

    private FileUploadResponse uploadAvatar(MultipartFile file, User user) throws IOException {
        // Upload to a specific folder 'avatars' with the user's ID as the public ID
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "avatars",
                "public_id", user.getId().toString(),
                "overwrite", true,
                "resource_type", "image"
        );
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        String secureUrl = (String) uploadResult.get("secure_url");

        // Update user's profile and save
        user.setAvatarUrl(secureUrl);
        userRepository.save(user);

        return FileUploadResponse.builder()
                .success(true)
                .message("Avatar uploaded successfully!")
                .secure_url(secureUrl)
                .build();
    }

    private FileUploadResponse uploadOrganizationLogo(MultipartFile file, User user) throws IOException {
        // Ensure the user has the 'organization' role
        if (!"organization".equalsIgnoreCase(user.getRole())) {
            throw new SecurityException("User does not have permission to upload an organization logo.");
        }

        // Find the organization associated with this user
        // This assumes a method findByOwnerId exists in OrganizationRepository
        Organization organization = organizationRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new RuntimeException("Organization not found for the current user."));

        // Upload to a specific folder 'logos' with the organization's ID as the public ID
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "logos",
                "public_id", organization.getId().toString(),
                "overwrite", true,
                "resource_type", "image"
        );
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        String secureUrl = (String) uploadResult.get("secure_url");

        // Update organization's logo URL and save
        organization.setLogoUrl(secureUrl);
        organizationRepository.save(organization);

        return FileUploadResponse.builder()
                .success(true)
                .message("Logo uploaded successfully!")
                .secure_url(secureUrl)
                .build();
    }

    private FileUploadResponse uploadGenericAttachment(MultipartFile file) throws IOException {
        // Upload attachments to a generic 'attachments' folder with a random public ID
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "attachments",
                "public_id", "attachment_" + UUID.randomUUID(),
                "resource_type", "auto" // Let Cloudinary detect the file type
        );
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

        return FileUploadResponse.builder()
                .success(true)
                .message("File uploaded successfully!")
                .url((String) uploadResult.get("secure_url"))
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .build();
    }
}
