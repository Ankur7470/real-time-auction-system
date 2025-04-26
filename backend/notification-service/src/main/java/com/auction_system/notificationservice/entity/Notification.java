package com.auction_system.notificationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String message;

    private String type;

    private Long auctionId;

    @Column(name = "is_read")  // Changed from 'read' to 'is_read' to avoid SQL reserved keyword
    private boolean isRead = false;

    private LocalDateTime timestamp = LocalDateTime.now();
}
