package com.auction_system.biddingservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long userId;
    private String message;
    private String type;
    private Long auctionId;
}
