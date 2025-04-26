package com.auction_system.biddingservice.service;

import com.auction_system.biddingservice.client.AuctionClient;
import com.auction_system.biddingservice.client.NotificationClient;
import com.auction_system.biddingservice.client.UserClient;
import com.auction_system.biddingservice.dto.AuctionDTO;
import com.auction_system.biddingservice.dto.BidDTO;
import com.auction_system.biddingservice.dto.NotificationDTO;
import com.auction_system.biddingservice.dto.UserDTO;
import com.auction_system.biddingservice.entity.Bid;
import com.auction_system.biddingservice.exception.BidNotFoundException;
import com.auction_system.biddingservice.repo.BidRepository;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private NotificationClient notificationClient;

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

    public BidDTO getBidById(Long id) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new BidNotFoundException("Bid not found with id: " + id));
        return convertToDTO(bid);
    }

    @Transactional
    public BidDTO createBid(BidDTO bidDTO, Long userId) {
        log.info("Creating bid for auction: {} by user: {}", bidDTO.getAuctionId(), userId);

        // First update the auction with the new bid
        Map<String, Object> bidRequest = new HashMap<>();
        bidRequest.put("amount", bidDTO.getAmount());

        try {
            AuctionDTO updatedAuction = auctionClient.updateBid(
                    bidDTO.getAuctionId(),
                    userId,
                    bidRequest
            );

            log.info("Auction updated successfully with new bid amount: {}", bidDTO.getAmount());

            // Now save the bid in our database
            Bid bid = new Bid();
            bid.setAuctionId(bidDTO.getAuctionId());
            bid.setUserId(userId);
            bid.setAmount(bidDTO.getAmount());

            Bid savedBid = bidRepository.save(bid);

            // Send notification about the new bid
            try {
                notificationClient.sendNotification(new NotificationDTO(
                        null,
                        "New bid of $" + bidDTO.getAmount() + " on auction: " + updatedAuction.getTitle(),
                        "NEW_BID",
                        bidDTO.getAuctionId()
                ));
            } catch (Exception e) {
                log.error("Failed to send notification for new bid: {}", e.getMessage());
            }

            return convertToDTO(savedBid);

        } catch (FeignException e) {
            log.error("Failed to update auction with new bid: {}", e.getMessage());
            throw new IllegalStateException("Failed to place bid: " + e.contentUTF8());
        }
    }

    private BidDTO convertToDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setAuctionId(bid.getAuctionId());
        dto.setUserId(bid.getUserId());
        dto.setAmount(bid.getAmount());
        dto.setTimestamp(bid.getTimestamp());

        try {
            // Get user information
            UserDTO user = userClient.getUserById(bid.getUserId());
            dto.setUser(user);

            // Get auction information
            AuctionDTO auction = auctionClient.getAuctionById(bid.getAuctionId());
            dto.setAuction(auction);
        } catch (FeignException e) {
            log.error("Error fetching related information: {}", e.getMessage());
            // Set basic information if service call fails
            UserDTO user = new UserDTO();
            user.setId(bid.getUserId());
            dto.setUser(user);

            AuctionDTO auction = new AuctionDTO();
            auction.setId(bid.getAuctionId());
            dto.setAuction(auction);
        }

        return dto;
    }
}
