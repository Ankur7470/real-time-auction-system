package com.auction_system.biddingservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BidRequest {
    private BigDecimal amount;

    public BidRequest(BigDecimal amount) {
        this.amount = amount;
    }
}
