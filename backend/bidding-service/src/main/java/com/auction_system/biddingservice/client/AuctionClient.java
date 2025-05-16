package com.auction_system.biddingservice.client;

import com.auction_system.biddingservice.dto.AuctionDTO;
import com.auction_system.biddingservice.dto.BidRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@FeignClient(name = "auction-service")
public interface AuctionClient {

    @GetMapping("/api/auctions/{id}")
    AuctionDTO getAuctionById(@PathVariable("id") Long id);

    @PostMapping("/api/auctions/{id}/bid")
    ResponseEntity<AuctionDTO> placeBid(
            @PathVariable("id") Long auctionId,
            @RequestBody BidRequest request,
            @RequestHeader("X-User-ID") Long userId);

    @PutMapping("/api/auctions/{id}/current-price")
    ResponseEntity<Void> updateCurrentPrice(
            @PathVariable("id") Long auctionId,
            @RequestBody BigDecimal amount);
}
