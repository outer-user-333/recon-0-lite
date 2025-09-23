package com.example.Recon0.models;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "achievements")
@Data
public class Achievement {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
}
