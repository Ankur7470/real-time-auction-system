//package com.auction_system.notificationservice.controller;
//
//import com.auction_system.notificationservice.dto.NotificationDTO;
//import com.auction_system.notificationservice.service.NotificationService;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.stereotype.Controller;
//
//@Controller
//@Slf4j
//public class WebSocketController {
//
//    @Autowired
//    private NotificationService notificationService;
//
//    @MessageMapping("/notification")
//    public void processNotification(@Payload NotificationDTO notificationDTO) {
//        log.info("Received WebSocket notification: {}", notificationDTO);
//        notificationService.sendNotification(notificationDTO);
//    }
//}
package com.auction_system.notificationservice.controller;

import com.auction_system.notificationservice.dto.BidNotificationDTO;
import com.auction_system.notificationservice.dto.NotificationDTO;
import com.auction_system.notificationservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("/api/notifications")
@Slf4j
public class WebSocketController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Handle general notifications
    @MessageMapping("/notification")
    public void processNotification(NotificationDTO notificationDTO) {
        log.info("Received WebSocket notification: {}", notificationDTO);
        NotificationDTO savedNotification = notificationService.sendNotification(notificationDTO);

        // Send to specific user's queue
        messagingTemplate.convertAndSendToUser(
                notificationDTO.getUserId().toString(),
                "/queue/notifications",
                savedNotification
        );
    }

    // Handle new bids for an auction
    @MessageMapping("/auction/{auctionId}/bids")
    @SendTo("/topic/auction/{auctionId}")
    public BidNotificationDTO newBid(@DestinationVariable Long auctionId, BidNotificationDTO bidNotification) {
        log.info("New bid for auction {}: {}", auctionId, bidNotification);
        // You could save the bid notification here if needed
        return bidNotification;
    }

    // Method to be called from other services via REST
    public void sendAuctionUpdate(Long auctionId, Object auctionData) {
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId, auctionData);
    }

    // Method to be called from other services via REST
    public void sendBidUpdate(Long auctionId, Object bidData) {
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId + "/bids", bidData);
    }
}
