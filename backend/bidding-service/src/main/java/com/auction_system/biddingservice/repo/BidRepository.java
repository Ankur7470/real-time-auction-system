package com.auction_system.biddingservice.repo;

import com.auction_system.biddingservice.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionIdOrderByTimestampDesc(Long auctionId);
    List<Bid> findByUserIdOrderByTimestampDesc(Long userId);
    Bid findTopByAuctionIdOrderByAmountDesc(Long auctionId);
}