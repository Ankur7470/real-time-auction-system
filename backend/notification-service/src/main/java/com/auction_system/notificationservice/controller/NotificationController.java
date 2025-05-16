package com.auction_system.notificationservice.controller;

import com.auction_system.notificationservice.dto.NotificationDTO;
import com.auction_system.notificationservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUserId(@PathVariable Long userId) {
        log.info("Fetching notifications for user with id: {}", userId);
        return ResponseEntity.ok(notificationService.getNotificationsByUserId(userId));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        log.info("Fetching unread notifications for user with id: {}", userId);
        return ResponseEntity.ok(notificationService.getUnreadNotificationsByUserId(userId));
    }

    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        log.info("Fetching unread notification count for user with id: {}", userId);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        log.info("Marking notification with id: {} as read", id);
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/user/{userId}/read/all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        log.info("Marking all notifications as read for user with id: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<NotificationDTO> sendNotification(@RequestBody NotificationDTO notificationDTO) {
        log.info("Sending notification: {}", notificationDTO);
        NotificationDTO sentNotification = notificationService.sendNotification(notificationDTO);
        return new ResponseEntity<>(sentNotification, HttpStatus.CREATED);
    }
}
