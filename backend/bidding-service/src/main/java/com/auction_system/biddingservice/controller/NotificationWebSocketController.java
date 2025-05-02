//package com.auction_system.biddingservice.controller;
//
//import com.auction_system.biddingservice.dto.NotificationDTO;
////import com.auction_system.biddingservice.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class NotificationWebSocketController {
//
//    @Autowired
//    private NotificationService notificationService;
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @MessageMapping("/notify")
//    public void handleNotification(NotificationDTO notificationDTO) {
//        NotificationDTO sentNotification =
//                notificationService.sendNotification(notificationDTO);
//
//        messagingTemplate.convertAndSendToUser(
//                sentNotification.getUserId().toString(),
//                "/queue/notifications",
//                sentNotification
//        );
//    }
//}
