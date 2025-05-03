package com.auction_system.biddingservice.service;

import com.auction_system.biddingservice.client.AuctionClient;
//import com.auction_system.biddingservice.client.NotificationClient;
import com.auction_system.biddingservice.client.UserClient;
import com.auction_system.biddingservice.dto.*;
import com.auction_system.biddingservice.entity.Bid;
import com.auction_system.biddingservice.exception.BidException;
import com.auction_system.biddingservice.exception.BidNotFoundException;
import jakarta.validation.constraints.NotNull;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.auction_system.biddingservice.repo.BidRepository;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private AuctionClient auctionClient;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<BidDTO> getBidsByAuctionId(Long auctionId) {
        List<Bid> bids = bidRepository.findByAuctionIdOrderByTimestampDesc(auctionId);
        return bids.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BidDTO> getBidsByUserId(Long userId) {
        List<Bid> bids = bidRepository.findByUserIdOrderByTimestampDesc(userId);
        return bids.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BidResponse placeBid(Bid bid) {

            // 1. Validate bid
            validateBid(bid);

            // 2. Call auction service
            ResponseEntity<AuctionDTO> response = auctionClient.placeBid(
                    bid.getAuctionId(),
                    new BidRequest(bid.getAmount()),
                    bid.getUserId()
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new BidException("Failed to place bid: " + response.getBody());
            }

            // 3. Update current price
//            ResponseEntity<Void> priceResponse = auctionClient.updateCurrentPrice(
//                    bid.getAuctionId(),
//                    bid.getAmount()
//            );
//
//            if (!priceResponse.getStatusCode().is2xxSuccessful()) {
//                log.warn("Failed to update current price for auction {}", bid.getAuctionId());
//            }

            // 4. Save bid
            Bid newbid = new Bid();
            newbid.setAuctionId(bid.getAuctionId());
            newbid.setUserId(bid.getUserId());
            newbid.setAmount(bid.getAmount());
            newbid.setTimestamp(LocalDateTime.now());
            newbid.setUsername(bid.getUsername());

            bidRepository.save(newbid);

            List<Bid> leaderboard = bidRepository.findTopBidsByAuctionIdOrderByAmountDesc(bid.getAuctionId(), 10);

//            messagingTemplate.convertAndSend("/topic/auction/" + bid.getAuctionId(), leaderboard);

            return new BidResponse(true, "Bid placed successfully", leaderboard);
    }

    private void validateBid(Bid bidDTO) {
        try {
            AuctionDTO auction = auctionClient.getAuctionById(bidDTO.getAuctionId());

            if (!Objects.equals(auction.getStatus(), "ACTIVE")) {
                throw new BidException("Auction is not active");
            }

            if (bidDTO.getAmount().compareTo(auction.getCurrentPrice()) <= 0) {
                throw new BidException("Bid amount must be higher than current price");
            }

            if (auction.getSeller().getId().equals(bidDTO.getUserId())) {
                throw new BidException("You cannot bid on your own auction");
            }

        } catch (FeignException e) {
            throw new BidException("Failed to validate bid: " + e.contentUTF8());
        }
    }

    public List<Bid> getLeaderboard(Long auctionId) {
        return bidRepository.findTopBidsByAuctionIdOrderByAmountDesc(auctionId, 10);
    }

    public List<Bid> getUserBids(String username) {
        return bidRepository.findByUsernameOrderByTimestampDesc(username);
    }

    private BidDTO convertToDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setAuctionId(bid.getAuctionId());
        dto.setUserId(bid.getUserId());
        dto.setAmount(bid.getAmount());
        dto.setTimestamp(bid.getTimestamp());
        try {
            UserDTO user = userClient.getUserById(bid.getUserId());
            dto.setUser(user);
        } catch (Exception e) {
            UserDTO user = new UserDTO();
            user.setId(bid.getUserId());
            dto.setUser(user);
        }
        return dto;
    }

    public void broadcastLeaderboard(Long auctionId) {
        List<Bid> leaderboard = getLeaderboard(auctionId);
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId, leaderboard);
    }
}
