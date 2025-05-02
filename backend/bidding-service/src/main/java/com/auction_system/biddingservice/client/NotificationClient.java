//package com.auction_system.biddingservice.client;
//
//import com.auction_system.biddingservice.dto.NotificationDTO;
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "notification-service")
//public interface NotificationClient {
//
//    @PostMapping("/api/notifications/send")
//    void sendNotification(@RequestBody NotificationDTO notification);
//
//    @PostMapping("/api/notifications/ws/auction/{auctionId}")
//    void sendAuctionUpdate(@PathVariable Long auctionId, @RequestBody Object auctionData);
//
//    @PostMapping("/api/notifications/ws/auction/{auctionId}/bids")
//    void sendBidUpdate(@PathVariable Long auctionId, @RequestBody Object bidData);
//}
