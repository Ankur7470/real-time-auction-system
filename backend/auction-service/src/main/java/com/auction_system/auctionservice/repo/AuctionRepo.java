package com.auction_system.auctionservice.repo;

import com.auction_system.auctionservice.model.Auction;
import com.auction_system.auctionservice.model.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepo extends JpaRepository<Auction, Long> {
    List<Auction> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<Auction> findByStatusOrderByEndTimeAsc(AuctionStatus status);
    List<Auction> findByEndTimeLessThanAndStatus(LocalDateTime endTime, AuctionStatus status);
    List<Auction> findByWinnerIdOrderByEndTimeDesc(Long winnerId);
}

