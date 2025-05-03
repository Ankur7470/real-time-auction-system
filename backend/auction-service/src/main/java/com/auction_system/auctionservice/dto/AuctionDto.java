package com.auction_system.auctionservice.dto;

import com.auction_system.auctionservice.model.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Starting price is required")
    @Positive(message = "Starting price must be positive")
    private BigDecimal startingPrice;

    private BigDecimal currentPrice;

    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    private String imageUrl;

    private String category;

    private UserDto seller;

    private UserDto winner;

    private AuctionStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

