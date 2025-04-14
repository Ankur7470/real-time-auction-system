package com.real_time_auction_system.user_service.repo;

import com.real_time_auction_system.user_service.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
}
