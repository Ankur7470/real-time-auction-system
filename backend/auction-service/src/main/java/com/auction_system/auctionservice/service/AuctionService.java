package com.auction_system.auctionservice.service;

//import com.auction_system.auctionservice.client.NotificationClient;
import com.auction_system.auctionservice.client.UserClient;
import com.auction_system.auctionservice.dto.AuctionDto;
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
        log.info("Fetching all active auctions");
        List<Auction> auctions = auctionRepository.findByStatusOrderByEndTimeAsc(AuctionStatus.ACTIVE);
        log.debug("Found {} active auctions", auctions.size());
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AuctionDto getAuctionById(Long id) {
        log.info("Fetching auction by id: {}", id);
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Auction not found with id: {}", id);
                    return new AuctionNotFoundException("Auction not found with id: " + id);
                });
        return convertToDTO(auction);
    }

    @Transactional
    public AuctionDto createAuction(AuctionDto auctionDTO, Long userId) {
        log.info("Creating auction for userId: {}", userId);
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
        log.info("Updating auction id: {} by userId: {}", id, userId);
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Auction not found with id: {}", id);
                    return new AuctionNotFoundException("Auction not found with id: " + id);
                });

        if (!auction.getSellerId().equals(userId)) {
            log.warn("Unauthorized attempt to update auction {} by user {}", id, userId);
            throw new UnauthorizedException("You are not authorized to update this auction");
        }

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            log.warn("Cannot update non-active auction with id: {}", id);
            throw new IllegalStateException("Cannot update a non-active auction");
        }

        auction.setTitle(auctionDTO.getTitle());
        auction.setDescription(auctionDTO.getDescription());
        auction.setImageUrl(auctionDTO.getImageUrl());
        auction.setCategory(auctionDTO.getCategory());

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
        log.info("Updating current price of auction {} to {}", auctionId, amount);
        Auction auction = convertToAuction(getAuctionById(auctionId));
        auction.setCurrentPrice(amount);
        log.debug("Updated in-memory auction price, persistence might be pending");
    }

    @Transactional
    public void deleteAuction(Long id, Long userId) {
        log.info("Deleting auction id: {} by user: {}", id, userId);
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Auction not found with id: {}", id);
                    return new AuctionNotFoundException("Auction not found with id: " + id);
                });

        if (!auction.getSellerId().equals(userId)) {
            log.warn("Unauthorized attempt to delete auction {} by user {}", id, userId);
            throw new UnauthorizedException("You are not authorized to delete this auction");
        }

        if (auction.getStatus() != AuctionStatus.ACTIVE ||
            !auction.getCurrentPrice().equals(auction.getStartingPrice())) {
            log.warn("Cannot delete auction {} as it's either not active or has bids", id);
            throw new IllegalStateException("Cannot delete an auction with bids or that is not active");
        }

        auctionRepository.delete(auction);
        log.info("Deleted auction with id: {}", id);
    }

    public List<AuctionDto> getAuctionsBySeller(Long sellerId) {
        log.info("Fetching auctions for sellerId: {}", sellerId);
        List<Auction> auctions = auctionRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AuctionDto> getAuctionsByWinner(Long winnerId) {
        log.info("Fetching auctions for winnerId: {}", winnerId);
        List<Auction> auctions = auctionRepository.findByWinnerIdOrderByEndTimeDesc(winnerId);
        return auctions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuctionDto updateBid(Long id, BigDecimal amount, Long userId) {
        log.info("User {} placing bid on auction {} with amount {}", userId, id, amount);
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Auction not found for bid with id: {}", id);
                    return new AuctionNotFoundException("Auction not found");
                });

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            log.warn("Attempted to bid on non-active auction {}", id);
            throw new IllegalStateException("Auction is not active");
        }

        if (amount.compareTo(auction.getCurrentPrice()) <= 0) {
            log.warn("Invalid bid: {} <= current price {}", amount, auction.getCurrentPrice());
            throw new IllegalArgumentException("Bid must be higher than current price");
        }

        if (auction.getSellerId().equals(userId)) {
            log.warn("Seller {} tried to bid on their own auction {}", userId, id);
            throw new IllegalArgumentException("Seller cannot bid on their own auction");
        }

        auction.setCurrentPrice(amount);
        auction.setWinnerId(userId);
        Auction updatedAuction = auctionRepository.save(auction);

        log.info("Bid updated for auction {}. New price: {}", id, amount);
        return convertToDTO(updatedAuction);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkEndedAuctions() {
        log.info("Checking for ended auctions at {}", LocalDateTime.now());
        List<Auction> endedAuctions = auctionRepository.findByEndTimeLessThanAndStatus(
                LocalDateTime.now(), AuctionStatus.ACTIVE);

        for (Auction auction : endedAuctions) {
            auction.setStatus(AuctionStatus.ENDED);
            auctionRepository.save(auction);
            log.info("Auction with id: {} has ended", auction.getId());
        }
    }

    private AuctionDto convertToDTO(Auction auction) {
//        log.debug("Converting Auction entity to DTO for id: {}", auction.getId());
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
            UserDto seller = userClient.getUserById(auction.getSellerId());
            dto.setSeller(seller);

            if (auction.getWinnerId() != null) {
                UserDto winner = userClient.getUserById(auction.getWinnerId());
                dto.setWinner(winner);
            }
        } catch (FeignException e) {
            log.error("Error fetching user information: {}", e.getMessage());
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

    private Auction convertToAuction(AuctionDto dto) {
//        log.debug("Converting DTO to Auction entity for id: {}", dto.getId());
        Auction auction = new Auction();
        auction.setId(dto.getId());
        auction.setTitle(dto.getTitle());
        auction.setDescription(dto.getDescription());
        auction.setStartingPrice(dto.getStartingPrice());
        auction.setCurrentPrice(dto.getCurrentPrice());
        auction.setStartTime(dto.getStartTime());
        auction.setEndTime(dto.getEndTime());
        auction.setImageUrl(dto.getImageUrl());
        auction.setCategory(dto.getCategory());
        auction.setStatus(dto.getStatus());
        auction.setCreatedAt(dto.getCreatedAt());
        auction.setUpdatedAt(dto.getUpdatedAt());

        if (dto.getSeller() != null) {
            auction.setSellerId(dto.getSeller().getId());
        } else {
//            log.warn("Auction DTO has no seller info. Throwing exception.");
            throw new IllegalArgumentException("Seller information is required");
        }

        if (dto.getWinner() != null) {
            auction.setWinnerId(dto.getWinner().getId());
        }

        return auction;
    }
}
