package com.auction_system.authservice.controller;

import com.auction_system.authservice.payload.UserDto;
import com.auction_system.authservice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        log.info("Received request to fetch user with ID: {}", id);
        try {
            UserDto userDto = userService.getUserById(id);
            log.info("Successfully fetched user with ID: {}", id);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            log.error("Failed to fetch user with ID: {}. Reason: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error occurred while fetching user with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
