package com.auction_system.biddingservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
    private Long id;

    @NotNull(message = "Auction ID is required")
    private Long auctionId;

    private Long userId;

    @NotNull(message = "Bid amount is required")
    @Positive(message = "Bid amount must be positive")
    private BigDecimal amount;

    private LocalDateTime timestamp;

    private UserDTO user;

    private AuctionDTO auction;
}
