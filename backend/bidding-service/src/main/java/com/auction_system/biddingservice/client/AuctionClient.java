package com.auction_system.biddingservice.client;

//import com.auction_system.common.config.FeignClientConfig;
import com.auction_system.biddingservice.dto.AuctionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "auction-service")
public interface AuctionClient {

    @GetMapping("/api/auctions/{id}")
    AuctionDTO getAuctionById(@PathVariable Long id);

    @PostMapping("/api/auctions/{id}/bid")
    AuctionDTO updateBid(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, Object> bidRequest);
}
