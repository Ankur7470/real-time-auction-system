//package com.auction_system.biddingservice.service;
//
//import com.auction_system.biddingservice.dto.NotificationDTO;
//import com.auction_system.biddingservice.dto.UserDTO;
//import com.auction_system.biddingservice.entity.Notification;
//import com.auction_system.biddingservice.repo.NotificationRepository;
//import jakarta.transaction.Transactional;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@Slf4j
//public class NotificationService {
//
//    @Autowired
//    private NotificationRepository notificationRepository;
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
//        List<Notification> notifications = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
//        return notifications.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public List<NotificationDTO> getUnreadNotificationsByUserId(Long userId) {
//        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByTimestampDesc(userId,false);
//        return notifications.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public long getUnreadCount(Long userId) {
//        return notificationRepository.countByUserIdAndIsRead(userId, false);
//    }
//
//    @Transactional
//    public NotificationDTO markAsRead(Long id) {
//        Notification notification = notificationRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
//
//        notification.setRead(true);
//        notification = notificationRepository.save(notification);
//
//        return convertToDTO(notification);
//    }
//
//    @Transactional
//    public void markAllAsRead(Long userId) {
//        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadOrderByTimestampDesc(userId, false);
//
//        for (Notification notification : unreadNotifications) {
//            notification.setRead(true);
//            notificationRepository.save(notification);
//        }
//    }
//
//    @Transactional
//    public NotificationDTO sendNotification(NotificationDTO notificationDTO) {
//        log.info("Sending notification: {}", notificationDTO);
//
//        Notification notification = new Notification();
//        notification.setUserId(notificationDTO.getUserId());
//        notification.setMessage(notificationDTO.getMessage());
//        notification.setType(notificationDTO.getType());
//        notification.setAuctionId(notificationDTO.getAuctionId());
//        notification.setRead(false);
//
//        notification = notificationRepository.save(notification);
//        NotificationDTO savedDTO = convertToDTO(notification);
//
//        // Send to specific user if userId is provided
//        if (notification.getUserId() != null) {
//            messagingTemplate.convertAndSendToUser(
//                    notification.getUserId().toString(),
//                    "/queue/notifications",
//                    savedDTO
//            );
//        }
//
//        // Send to topic based on notification type
//        if (notification.getType() != null) {
//            if (notification.getType().equals("NEW_BID") && notification.getAuctionId() != null) {
//                messagingTemplate.convertAndSend(
//                        "/topic/bids/" + notification.getAuctionId(),
//                        savedDTO
//                );
//            } else if (notification.getType().equals("NEW_AUCTION")) {
//                messagingTemplate.convertAndSend(
//                        "/topic/auctions",
//                        savedDTO
//                );
//            } else if (notification.getType().equals("AUCTION_ENDED") && notification.getAuctionId() != null) {
//                messagingTemplate.convertAndSend(
//                        "/topic/auction/" + notification.getAuctionId(),
//                        savedDTO
//                );
//            }
//        }
//
//        return savedDTO;
//    }
//
//    private NotificationDTO convertToDTO(Notification notification) {
//        return null;
//    }
//
//    public Notification createNotification(Long userId, String message) {
////        User user = userRepository.findById(userId)
////                .orElseThrow(() -> new RuntimeException("User not found"));
//        UserDTO userDTO = new UserDTO();
//
//        Notification notification = new Notification();
//        notification.setUserId(user);
//        notification.setMessage(message);
//        notification.setTimestamp(LocalDateTime.now());
//        notification.setRead(false);
//
//        return notificationRepository.save(notification);
//    }
//}