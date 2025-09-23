package com.example.Recon0.services;

import com.example.Recon0.dto.AuthResponse;
import com.example.Recon0.dto.LoginRequest;
import com.example.Recon0.dto.RegisterRequest;
import com.example.Recon0.dto.UserDto;
import com.example.Recon0.models.Organization;
import com.example.Recon0.models.User;
import com.example.Recon0.repositories.OrganizationRepository;
import com.example.Recon0.repositories.UserRepository;
import com.example.Recon0.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final OrganizationRepository organizationRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil,OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.organizationRepository=organizationRepository;
    }

    @Transactional // Make this transactional to ensure both save or none do
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken!");
        }
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .role(registerRequest.getRole())
                .status("Active")
                .build();

        User savedUser = userRepository.save(user);

        // If the role is 'organization', create and link the organization
        if ("organization".equalsIgnoreCase(savedUser.getRole())) {
            if (registerRequest.getOrganizationName() == null || registerRequest.getOrganizationName().isBlank()) {
                throw new IllegalArgumentException("Organization name is required for organization role.");
            }
            Organization organization = Organization.builder()
                    .name(registerRequest.getOrganizationName())
                    .owner(savedUser) // LINK THE USER HERE
                    .build();
            organizationRepository.save(organization);
        }

        String token = jwtUtil.generateToken(savedUser);

        // Create a DTO for the response
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getUsername(), savedUser.getRole());

        // Build and return the full AuthResponse
        return AuthResponse.builder()
                .success(true)
                .message("User registered successfully!")
                .token(token)
                .user(userDto)
                .build();
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        // 1. Use AuthenticationManager to validate the email and password.
        // Spring Security will throw an exception here if credentials are bad.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // 2. If successful, set the authentication in the security context.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Get the full User object from the authenticated principal.
        User user = (User) authentication.getPrincipal();

        // 4. Generate the JWT.
        String token = jwtUtil.generateToken(user);

        // 5. Create a DTO with non-sensitive user info for the response.
        UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getRole());

        // 6. Build and return the final AuthResponse object.
        return AuthResponse.builder()
                .success(true)
                .message("Login successful!")
                .token(token)
                .user(userDto)
                .build();
    }
}