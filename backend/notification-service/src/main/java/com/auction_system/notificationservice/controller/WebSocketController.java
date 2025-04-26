package com.auction_system.notificationservice.controller;

import com.auction_system.notificationservice.dto.NotificationDTO;
import com.auction_system.notificationservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class WebSocketController {

    @Autowired
    private NotificationService notificationService;

    @MessageMapping("/notification")
    public void processNotification(@Payload NotificationDTO notificationDTO) {
        log.info("Received WebSocket notification: {}", notificationDTO);
        notificationService.sendNotification(notificationDTO);
    }
}