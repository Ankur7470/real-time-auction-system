package com.auction_system.biddingservice.service;

import com.auction_system.biddingservice.client.AuctionClient;
//import com.auction_system.biddingservice.client.NotificationClient;
import com.auction_system.biddingservice.client.UserClient;
import com.auction_system.biddingservice.dto.*;
import com.auction_system.biddingservice.model.Bid;
import com.auction_system.biddingservice.exception.BidException;
import com.auction_system.biddingservice.model.Notification;
import com.auction_system.biddingservice.repo.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.auction_system.biddingservice.repo.BidRepository;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<BidDTO> getBidsByUserId(Long userId) {
        log.info("Fetching bids for user with id: {}", userId);
        List<Bid> bids = bidRepository.findByUserIdOrderByTimestampDesc(userId);
        return bids.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BidResponse placeBid(Bid bid) {
        log.info("Placing bid for auctionId: {}, userId: {}, amount: {}", bid.getAuctionId(), bid.getUserId(), bid.getAmount());

        validateBid(bid);

        log.debug("Calling auction service to place bid");
        ResponseEntity<AuctionDTO> response = auctionClient.placeBid(
                bid.getAuctionId(), new BidRequest(bid.getAmount()), bid.getUserId()
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Failed to place bid via auction service. Response: {}", response);
            throw new BidException("Failed to place bid: " + response.getBody());
        }

        log.debug("Saving bid to database");
        Bid newbid = new Bid();
        newbid.setAuctionId(bid.getAuctionId());
        newbid.setUserId(bid.getUserId());
        newbid.setAmount(bid.getAmount());
        newbid.setTimestamp(LocalDateTime.now());
        newbid.setUsername(bid.getUsername());
        bidRepository.save(newbid);

        log.debug("Creating notifications for bid");
        AuctionDTO auction = auctionClient.getAuctionById(bid.getAuctionId());
        createNotifications(newbid, auction);

        List<Bid> leaderboard = bidRepository.findTopBidsByAuctionIdOrderByAmountDesc(bid.getAuctionId(), 10);

        log.info("Bid placed successfully for auctionId: {}", bid.getAuctionId());
        return new BidResponse(true, "Bid placed successfully", leaderboard);
    }


    private void validateBid(Bid bidDTO) {
        log.debug("Validating bid for auctionId: {}, userId: {}", bidDTO.getAuctionId(), bidDTO.getUserId());
        try {
            AuctionDTO auction = auctionClient.getAuctionById(bidDTO.getAuctionId());

            if (!Objects.equals(auction.getStatus(), "ACTIVE")) {
                log.warn("Auction {} is not active", bidDTO.getAuctionId());
                throw new BidException("Auction is not active");
            }

            if (bidDTO.getAmount().compareTo(auction.getCurrentPrice()) <= 0) {
                log.warn("Bid amount {} is not higher than current price {}", bidDTO.getAmount(), auction.getCurrentPrice());
                throw new BidException("Bid amount must be higher than current price");
            }

            if (auction.getSeller().getId().equals(bidDTO.getUserId())) {
                log.warn("User {} tried to bid on own auction {}", bidDTO.getUserId(), bidDTO.getAuctionId());
                throw new BidException("You cannot bid on your own auction");
            }

        } catch (FeignException e) {
            log.error("Feign exception while validating bid: {}", e.contentUTF8());
            throw new BidException("Failed to validate bid: " + e.contentUTF8());
        }
    }

    public List<Bid> getLeaderboard(Long auctionId) {
        log.info("Fetching leaderboard for auctionId: {}", auctionId);
        return bidRepository.findTopBidsByAuctionIdOrderByAmountDesc(auctionId, 10);
    }

    private BidDTO convertToDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setAuctionId(bid.getAuctionId());
        dto.setUserId(bid.getUserId());
        dto.setAmount(bid.getAmount());
        dto.setTimestamp(bid.getTimestamp());

        // Add user details
        try {
            UserDTO user = userClient.getUserById(bid.getUserId());
            dto.setUser(user);
        } catch (Exception e) {
            UserDTO user = new UserDTO();
            user.setId(bid.getUserId());
            dto.setUser(user);
        }

        // Add auction details - you'll need to implement this
        try {
            AuctionDTO auction = auctionClient.getAuctionById(bid.getAuctionId());
            dto.setAuction(auction);
        } catch (Exception e) {
            AuctionDTO auction = new AuctionDTO();
            auction.setId(bid.getAuctionId());
            dto.setAuction(auction);
        }

        return dto;
    }

    private void createNotifications(Bid bid, AuctionDTO auction) {
        log.info("Creating notifications for auctionId: {}, bid amount: {}", bid.getAuctionId(), bid.getAmount());

        // Notify seller
        Notification sellerNotification = new Notification();
        sellerNotification.setUserId(auction.getSeller().getId());
        sellerNotification.setMessage("New bid of " + bid.getAmount() + " on your auction: " + auction.getTitle());
        sellerNotification.setAuctionId(bid.getAuctionId());
        notificationRepository.save(sellerNotification);

        // Notify previous highest bidder
        Optional<Bid> previousHighest = Optional.ofNullable(bidRepository.findTopByAuctionIdOrderByAmountDesc(bid.getAuctionId()));
        if (previousHighest.isPresent() && !previousHighest.get().getUserId().equals(bid.getUserId())) {
            Notification outbidNotification = new Notification();
            outbidNotification.setUserId(previousHighest.get().getUserId());
            outbidNotification.setMessage("You've been outbid on auction: " + auction.getTitle());
            outbidNotification.setAuctionId(bid.getAuctionId());
            notificationRepository.save(outbidNotification);

            messagingTemplate.convertAndSendToUser(
                    outbidNotification.getUserId().toString(),
                    "/queue/notifications",
                    outbidNotification
            );
            log.info("Outbid notification sent to user {}", outbidNotification.getUserId());
        }

        messagingTemplate.convertAndSendToUser(
                sellerNotification.getUserId().toString(),
                "/queue/notifications",
                sellerNotification
        );
        log.info("Notification sent to seller {}", sellerNotification.getUserId());
    }

    public List<Notification> getUserNotifications(Long userId) {
        log.info("Fetching notifications for userId: {}", userId);
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
