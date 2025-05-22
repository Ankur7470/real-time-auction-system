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
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Controller
public class WebSocketController {

    @Autowired
    BidService bidService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/bid")
    public void placeBid(@Payload @Valid Bid bid,
                         SimpMessageHeaderAccessor headerAccessor) {
        log.info("WebSocket: Received bid for auctionId: {}, userId: {}", bid.getAuctionId(), bid.getUserId());

        if (bid.getUserId() == null) {
            log.warn("WebSocket: Received bid without user ID");
            throw new BidException("User ID is required");
        }

        BidResponse response = bidService.placeBid(bid);

        messagingTemplate.convertAndSend(
                "/topic/auction/" + bid.getAuctionId(),
                response
        );

        log.info("WebSocket: Broadcasted bid response to topic for auctionId: {}", bid.getAuctionId());
    }

    @MessageMapping("/notifications")
    public void getNotifications(@Payload Long userId) {
        log.info("WebSocket: Fetching notifications for userId: {}", userId);

        List<Notification> notifications = bidService.getUserNotifications(userId);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                notifications
        );

        log.info("WebSocket: Notifications sent to user queue for userId: {}", userId);
    }

}