package com.auction_system.biddingservice.controller;

import com.auction_system.biddingservice.dto.BidResponse;
import com.auction_system.biddingservice.model.Bid;
import com.auction_system.biddingservice.exception.BidException;
import com.auction_system.biddingservice.model.Notification;
import com.auction_system.biddingservice.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;


@Controller
public class WebSocketController {

    @Autowired
    BidService bidService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/bid")
    public void placeBid(@Payload @Valid Bid bid,
                                SimpMessageHeaderAccessor headerAccessor) {

        System.out.println("Received bid: {}" + bid.getUserId());
        System.out.println("Received bid: {}" + bid.getUsername());

        // Additional validation
        if (bid.getUserId() == null) {
            throw new BidException("User ID is required");
        }

        BidResponse response = bidService.placeBid(bid);

        messagingTemplate.convertAndSend(
                "/topic/auction/" + bid.getAuctionId(),
                response
        );
    }

    @MessageMapping("/notifications")
    public void getNotifications(@Payload Long userId) {
        List<Notification> notifications = bidService.getUserNotifications(userId);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                notifications
        );
    }

}