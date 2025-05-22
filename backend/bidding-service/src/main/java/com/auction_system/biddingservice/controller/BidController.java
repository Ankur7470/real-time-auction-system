package com.auction_system.biddingservice.controller;

import com.auction_system.biddingservice.dto.BidDTO;
import com.auction_system.biddingservice.model.Bid;
import com.auction_system.biddingservice.model.Notification;
import com.auction_system.biddingservice.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<Bid>> getBidsByAuctionId(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getLeaderboard(auctionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDTO>> getBidsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bidService.getBidsByUserId(userId));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(bidService.getUserNotifications(userId));
    }

}
