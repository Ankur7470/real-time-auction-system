package com.auction_system.biddingservice.controller;

import com.auction_system.biddingservice.dto.BidDTO;
import com.auction_system.biddingservice.service.BidService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@Slf4j
public class BidController {

    @Autowired
    private BidService bidService;

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidDTO>> getBidsByAuctionId(@PathVariable Long auctionId) {
        log.info("Fetching bids for auction with id: {}", auctionId);
        return ResponseEntity.ok(bidService.getBidsByAuctionId(auctionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDTO>> getBidsByUserId(@PathVariable Long userId) {
        log.info("Fetching bids for user with id: {}", userId);
        return ResponseEntity.ok(bidService.getBidsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BidDTO> getBidById(@PathVariable Long id) {
        log.info("Fetching bid with id: {}", id);
        return ResponseEntity.ok(bidService.getBidById(id));
    }

    @PostMapping
    public ResponseEntity<BidDTO> createBid(
            @Valid @RequestBody BidDTO bidDTO,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Creating new bid for auction: {} by user: {}", bidDTO.getAuctionId(), userId);
        BidDTO createdBid = bidService.createBid(bidDTO, userId);
        return new ResponseEntity<>(createdBid, HttpStatus.CREATED);
    }
}
