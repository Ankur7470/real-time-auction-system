package com.auction_system.auctionservice.service;

//import com.auction_system.auctionservice.client.NotificationClient;
import com.auction_system.auctionservice.client.UserClient;
import com.auction_system.auctionservice.dto.AuctionDto;
import com.auction_system.auctionservice.dto.NotificationDto;
import com.auction_system.auctionservice.dto.UserDto;
import com.auction_system.auctionservice.exception.AuctionNotFoundException;
import com.auction_system.auctionservice.exception.UnauthorizedException;
import com.auction_system.auctionservice.model.Auction;
import com.auction_system.auctionservice.model.AuctionStatus;
import com.auction_system.auctionservice.repo.AuctionRepo;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuctionService {

    @Autowired
    private AuctionRepo auctionRepository;

    @Autowired
    private UserClient userClient;

    public List<AuctionDto> getAllActiveAuctions() {
        List<Auction> auctions = auctionRepository.findByStatusOrderByEndTimeAsc(AuctionStatus.ACTIVE);
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Auction getAuctionById(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));
        return auction;
    }

    @Transactional
    public AuctionDto createAuction(AuctionDto auctionDTO, Long userId) {
        Auction auction = new Auction();
        auction.setTitle(auctionDTO.getTitle());
        auction.setDescription(auctionDTO.getDescription());
        auction.setStartingPrice(auctionDTO.getStartingPrice());
        auction.setCurrentPrice(auctionDTO.getStartingPrice());
        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(auctionDTO.getEndTime());
        auction.setImageUrl(auctionDTO.getImageUrl());
        auction.setCategory(auctionDTO.getCategory());
        auction.setSellerId(userId);
        auction.setStatus(AuctionStatus.ACTIVE);

        Auction savedAuction = auctionRepository.save(auction);
        log.info("Created auction with id: {}", savedAuction.getId());

        return convertToDTO(savedAuction);
    }

    @Transactional
    public AuctionDto updateAuction(Long id, AuctionDto auctionDTO, Long userId) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));

        if (!auction.getSellerId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this auction");
        }

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update a non-active auction");
        }

        auction.setTitle(auctionDTO.getTitle());
        auction.setDescription(auctionDTO.getDescription());
        auction.setImageUrl(auctionDTO.getImageUrl());
        auction.setCategory(auctionDTO.getCategory());

        // Don't update prices or end time if bids have been placed
        if (auction.getCurrentPrice().equals(auction.getStartingPrice())) {
            auction.setStartingPrice(auctionDTO.getStartingPrice());
            auction.setCurrentPrice(auctionDTO.getStartingPrice());
            auction.setEndTime(auctionDTO.getEndTime());
        }

        Auction updatedAuction = auctionRepository.save(auction);
        log.info("Updated auction with id: {}", updatedAuction.getId());

        return convertToDTO(updatedAuction);
    }


    @Transactional
    public void updateAuctionCurrentPrice(Long auctionId, BigDecimal amount) {
        Auction auction = getAuctionById(auctionId);
        auction.setCurrentPrice(amount);
    }

    @Transactional
    public void deleteAuction(Long id, Long userId) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));

        if (!auction.getSellerId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this auction");
        }

        if (auction.getStatus() != AuctionStatus.ACTIVE ||
                !auction.getCurrentPrice().equals(auction.getStartingPrice())) {
            throw new IllegalStateException("Cannot delete an auction with bids or that is not active");
        }

        auctionRepository.delete(auction);
        log.info("Deleted auction with id: {}", id);
    }

    public List<AuctionDto> getAuctionsBySeller(Long sellerId) {
        List<Auction> auctions = auctionRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AuctionDto> getAuctionsByWinner(Long winnerId) {
        List<Auction> auctions = auctionRepository.findByWinnerIdOrderByEndTimeDesc(winnerId);
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

@Transactional
public AuctionDto updateBid(Long id, BigDecimal amount, Long userId) {
    Auction auction = auctionRepository.findById(id)
            .orElseThrow(() -> new AuctionNotFoundException("Auction not found"));

    // Validate auction status
    if (auction.getStatus() != AuctionStatus.ACTIVE) {
        throw new IllegalStateException("Auction is not active");
    }

    // Validate bid amount
    if (amount.compareTo(auction.getCurrentPrice()) <= 0) {
        throw new IllegalArgumentException("Bid must be higher than current price");
    }

    // Validate user is not seller
    if (auction.getSellerId().equals(userId)) {
        throw new IllegalArgumentException("Seller cannot bid on their own auction");
    }

    // Update auction
    auction.setCurrentPrice(amount);
    auction.setWinnerId(userId);
    Auction updatedAuction = auctionRepository.save(auction);

    log.info("Updated bid for auction {} to {}", id, amount);

    return convertToDTO(updatedAuction);
}

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void checkEndedAuctions() {
        List<Auction> endedAuctions = auctionRepository.findByEndTimeLessThanAndStatus(
                LocalDateTime.now(), AuctionStatus.ACTIVE);

        for (Auction auction : endedAuctions) {
            auction.setStatus(AuctionStatus.ENDED);
            auctionRepository.save(auction);

            log.info("Auction with id: {} has ended", auction.getId());
        }
    }

    private AuctionDto convertToDTO(Auction auction) {
        AuctionDto dto = new AuctionDto();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setStartingPrice(auction.getStartingPrice());
        dto.setCurrentPrice(auction.getCurrentPrice());
        dto.setStartTime(auction.getStartTime());
        dto.setEndTime(auction.getEndTime());
        dto.setImageUrl(auction.getImageUrl());
        dto.setCategory(auction.getCategory());
        dto.setStatus(auction.getStatus());
        dto.setCreatedAt(auction.getCreatedAt());
        dto.setUpdatedAt(auction.getUpdatedAt());

        try {
            // Get seller information
            UserDto seller = userClient.getUserById(auction.getSellerId());
            dto.setSeller(seller);

            // Get winner information if exists
            if (auction.getWinnerId() != null) {
                UserDto winner = userClient.getUserById(auction.getWinnerId());
                dto.setWinner(winner);
            }
        } catch (FeignException e) {
            log.error("Error fetching user information: {}", e.getMessage());
            // Set basic user info if service call fails
            UserDto seller = new UserDto();
            seller.setId(auction.getSellerId());
            dto.setSeller(seller);

            if (auction.getWinnerId() != null) {
                UserDto winner = new UserDto();
                winner.setId(auction.getWinnerId());
                dto.setWinner(winner);
            }
        }

        return dto;
    }
}
