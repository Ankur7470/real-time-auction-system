package com.auction_system.auctionservice.controller;

import com.auction_system.auctionservice.dto.AuctionDto;
import com.auction_system.auctionservice.service.AuctionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auctions")
@Slf4j
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping("/hello")
    public String test() {
        return "Hello World";
    }

    @GetMapping
    public ResponseEntity<List<AuctionDto>> getAllAuctions() {
        log.info("Fetching all active auctions");
        return ResponseEntity.ok(auctionService.getAllActiveAuctions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDto> getAuctionById(@PathVariable Long id) {
        log.info("Fetching auction with id: {}", id);
        return ResponseEntity.ok(auctionService.getAuctionById(id));
    }

    @PostMapping
    public ResponseEntity<AuctionDto> createAuction(
            @Valid @RequestBody AuctionDto auctionDTO,
            @RequestHeader(value = "X-User-ID") Long userId) {
        log.info("Creating new auction: {}", auctionDTO.getTitle());
        AuctionDto createdAuction = auctionService.createAuction(auctionDTO, userId);
        return new ResponseEntity<>(createdAuction, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionDto> updateAuction(
            @PathVariable Long id,
            @Valid @RequestBody AuctionDto auctionDTO,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Updating auction with id: {}", id);
        return ResponseEntity.ok(auctionService.updateAuction(id, auctionDTO, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuction(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Deleting auction with id: {}", id);
        auctionService.deleteAuction(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<AuctionDto>> getAuctionsBySeller(@PathVariable Long sellerId) {
        log.info("Fetching auctions for seller with id: {}", sellerId);
        return ResponseEntity.ok(auctionService.getAuctionsBySeller(sellerId));
    }

    @GetMapping("/winner/{winnerId}")
    public ResponseEntity<List<AuctionDto>> getAuctionsByWinner(@PathVariable Long winnerId) {
        log.info("Fetching auctions won by user with id: {}", winnerId);
        return ResponseEntity.ok(auctionService.getAuctionsByWinner(winnerId));
    }

    @PostMapping("/{id}/bid")
    public ResponseEntity<AuctionDto> placeBid(
            @PathVariable Long id,
            @RequestBody Map<String, Object> bidRequest,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Placing bid on auction with id: {}", id);

        if (!bidRequest.containsKey("amount")) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Double amount = Double.parseDouble(bidRequest.get("amount").toString());
            AuctionDto updatedAuction = auctionService.updateBid(id, java.math.BigDecimal.valueOf(amount), userId);
            return ResponseEntity.ok(updatedAuction);
        } catch (NumberFormatException e) {
            log.error("Invalid bid amount format", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
