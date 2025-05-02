package com.auction_system.biddingservice.controller;

import com.auction_system.biddingservice.client.AuctionClient;
import com.auction_system.biddingservice.dto.BidDTO;
import com.auction_system.biddingservice.dto.AuctionDTO;
import com.auction_system.biddingservice.entity.Bid;
import com.auction_system.biddingservice.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ErrorMessage;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketController {

//    private static final Logger log = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private BidService bidService;

    @Autowired
    private AuctionClient auctionClient;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/bid")
    public void handleBid(@Payload BidDTO bidDto) {
        try {
            // Process the bid
            Bid bid = bidService.placeBid(bidDto);

            // Get updated auction details
            AuctionDTO auction = auctionClient.getAuctionById(bidDto.getAuctionId());

            // Prepare success response with all needed data
            Map<String, Object> response = new HashMap<>();
            response.put("type", "BID_SUCCESS");
            response.put("auction", auction);
            response.put("bid", convertToBidDTO(bid));
            response.put("timestamp", System.currentTimeMillis());

            // Broadcast updates to all subscribers
            messagingTemplate.convertAndSend(
                    "/topic/auction/" + bidDto.getAuctionId(),
                    response
            );

            // Send confirmation to the bidder
            messagingTemplate.convertAndSendToUser(
//
                    "/queue/confirmations",
                    response
            );

        } catch (Exception e) {
//            log.error("Failed to process bid: {}", e.getMessage());

            // Prepare error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("type", "BID_ERROR");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());
//
//            messagingTemplate.convertAndSendToUser(
//                    principal.getName(),
//                    "/queue/errors",
//                    errorResponse
//            );
        }
    }

    private BidDTO convertToBidDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setAuctionId(bid.getAuctionId());
        dto.setUserId(bid.getUserId());
        dto.setAmount(bid.getAmount());
        dto.setTimestamp(bid.getTimestamp());
        return dto;
    }
}