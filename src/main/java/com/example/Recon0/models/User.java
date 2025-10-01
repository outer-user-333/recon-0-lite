package com.example.Recon0.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails { // Implement the UserDetails interface

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private UUID id;

        @Column(unique = true, nullable = false)
        private String email;

        @Column(unique = true)
        private String username;

        private String password;

        @Column(name = "full_name")
        private String full_name;
        private String role;
        private String status;
        private String bio;

        @Column(name = "reputation_points")
        private int reputationPoints;

        @Column(name = "avatar_url")
        private String avatar_url;

        @CreationTimestamp
        @Column(name = "created_at", nullable = false, updatable = false)
        private OffsetDateTime created_at;

        @CreationTimestamp
        @Column(name = "updated_at", nullable = false)
        private OffsetDateTime updated_at;

       // @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        // private List<Organization> organizations = new ArrayList<>();



        // --- Implementation of UserDetails methods ---

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                // Returns the user's role for authorization checks
                return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.toUpperCase()));
        }

        @Override
        public String getPassword() {
                return this.password;
        }

        /**
         * THIS IS THE METHOD THAT WAS MISSING.
         * Spring Security calls this method to get the unique identifier for the user.
         * In our case, the user logs in with their email, so we return the email field.
         */
        @Override
        public String getUsername() {
                return this.email;
        }

        @Override
        public boolean isAccountNonExpired() {
                return true; // You can add logic here if accounts can expire
        }

        @Override
        public boolean isAccountNonLocked() {
                // The account is "locked" if the user status is "Suspended"
                return !"Suspended".equals(this.status);
        }

        @Override
        public boolean isCredentialsNonExpired() {
                return true; // You can add logic here for password expiration
        }

        @Override
        public boolean isEnabled() {
                // The user is "enabled" if their status is "Active"
                return "Active".equals(this.status);
        }
}
