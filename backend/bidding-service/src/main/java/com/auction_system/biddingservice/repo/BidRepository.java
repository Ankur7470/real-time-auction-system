package com.auction_system.biddingservice.repo;

import com.auction_system.biddingservice.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionIdOrderByTimestampDesc(Long auctionId);
    List<Bid> findByUserIdOrderByTimestampDesc(Long userId);
    Bid findTopByAuctionIdOrderByAmountDesc(Long auctionId);

    @Query("SELECT b FROM Bid b WHERE b.auctionId = ?1 ORDER BY b.amount DESC LIMIT ?2")
    List<Bid> findTopBidsByAuctionIdOrderByAmountDesc(Long auctionId, int limit);

    List<Bid> findByUsernameOrderByTimestampDesc(String username);

    List<Bid> findByAuctionIdOrderByAmountDesc(Long auctionId);
}