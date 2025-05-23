package com.auction_system.auctionservice.controller;

import com.auction_system.auctionservice.dto.AuctionDto;
import com.auction_system.auctionservice.dto.BidRequest;
import com.auction_system.auctionservice.service.AuctionService;
import jakarta.validation.Valid;
// import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
// @Slf4j
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<List<AuctionDto>> getAllAuctions() {
        return ResponseEntity.ok(auctionService.getAllActiveAuctions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDto> getAuctionById(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuctionById(id));
    }


    @PostMapping
    public ResponseEntity<AuctionDto> createAuction(
            @Valid @RequestBody AuctionDto auctionDTO,
            @RequestHeader(value = "X-User-ID") Long userId) {
        AuctionDto createdAuction = auctionService.createAuction(auctionDTO, userId);
        return new ResponseEntity<>(createdAuction, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionDto> updateAuction(
            @PathVariable Long id,
            @Valid @RequestBody AuctionDto auctionDTO,
            @RequestHeader("X-User-ID") Long userId) {
        return ResponseEntity.ok(auctionService.updateAuction(id, auctionDTO, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuction(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId) {
        auctionService.deleteAuction(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/current-price")
    public void updateAuctionCurrentPrice(Long auctionId, BigDecimal amount) {
        auctionService.updateAuctionCurrentPrice(auctionId, amount);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<AuctionDto>> getAuctionsBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(auctionService.getAuctionsBySeller(sellerId));
    }

    @GetMapping("/winner/{winnerId}")
    public ResponseEntity<List<AuctionDto>> getAuctionsByWinner(@PathVariable Long winnerId) {
        return ResponseEntity.ok(auctionService.getAuctionsByWinner(winnerId));
    }

@PostMapping("/{id}/bid")
public ResponseEntity<AuctionDto> placeBid(
        @PathVariable Long id,
        @RequestBody BidRequest request, // Create dedicated request DTO
        @RequestHeader("X-User-ID") Long userId) {

        AuctionDto updatedAuction = auctionService.updateBid(
                id,
                request.getAmount(),
                userId
        );
        return ResponseEntity.ok(updatedAuction);
}
}
