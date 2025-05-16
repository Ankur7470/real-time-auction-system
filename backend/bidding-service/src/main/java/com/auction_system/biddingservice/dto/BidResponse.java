package com.auction_system.biddingservice.dto;

import com.auction_system.biddingservice.model.Bid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidResponse {
    private boolean success;
    private String message;
    private List<Bid> leaderboard;
}
