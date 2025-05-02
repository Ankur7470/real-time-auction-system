package com.auction_system.biddingservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String message;
    private String type;
    private Long auctionId;
    private boolean read;
    private LocalDateTime timestamp;
}
