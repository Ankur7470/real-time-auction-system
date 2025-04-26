package com.auction_system.auctionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long userId;
    private String message;
    private String type;
    private Long auctionId;
}
//public class NotificationDto {
//    private Long id;
//    private Long userId;
//    private String message;
//    private String type;
//    private Long auctionId;
//    private boolean read;
//    private LocalDateTime timestamp;
//}
