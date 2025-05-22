package com.auction_system.authservice.service;

import com.auction_system.authservice.model.User;
import com.auction_system.authservice.payload.UserDto;
import com.auction_system.authservice.repo.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public UserDto getUserById(Long id) {
        log.debug("Searching for user with ID: {}", id);

        return userRepo.findById(id)
                .map(user -> {
                    log.debug("User found with ID: {}", id);
                    return new UserDto(
                            user.getId(),
                            user.getEmail(),
                            user.getUsername()
                    );
                })
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", id);
                    return new RuntimeException("User not found");
                });
    }
}
