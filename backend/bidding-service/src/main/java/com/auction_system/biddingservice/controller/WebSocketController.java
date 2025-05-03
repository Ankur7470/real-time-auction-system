package com.auction_system.biddingservice.controller;

import com.auction_system.biddingservice.client.AuctionClient;
import com.auction_system.biddingservice.dto.BidDTO;
import com.auction_system.biddingservice.dto.AuctionDTO;
import com.auction_system.biddingservice.dto.BidResponse;
import com.auction_system.biddingservice.entity.Bid;
import com.auction_system.biddingservice.exception.BidException;
import com.auction_system.biddingservice.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ErrorMessage;
import org.springframework.stereotype.Controller;


@Controller
public class WebSocketController {

    @Autowired
    BidService bidService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/bid")
//    @SendTo("/topic/auction/{id}") // Alternative to manual broadcast //here added # bid.
    public void placeBid(@Payload @Valid Bid bid,
                                SimpMessageHeaderAccessor headerAccessor) {

//        log.info("Received bid: {}", bid);
        System.out.println("Received bid: {}" + bid.getUserId());
        System.out.println("Received bid: {}" + bid.getUsername());

//        String username = (String) headerAccessor.getSessionAttributes().get("username");
//        if (username == null) {
//            throw new BidException("User not authenticated");
//        }

        // Additional validation
        if (bid.getUserId() == null) {
            throw new BidException("User ID is required");
        }

//        bid.setUsername(username);
        BidResponse response = bidService.placeBid(bid);

        messagingTemplate.convertAndSend(
                "/topic/auction/" + bid.getAuctionId(),
                response
        );

    }

}