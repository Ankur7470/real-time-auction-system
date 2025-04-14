package com.real_time_auction_system.user_service.controller;

import com.real_time_auction_system.user_service.dto.LoginRequest;
import com.real_time_auction_system.user_service.entity.Users;
import com.real_time_auction_system.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("test Endpoint Ok");
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/register")
    public Users createUser(@RequestBody @Valid Users users) {
        return userService.register(users);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest request) {
        String response = userService.login(request);
        return ResponseEntity.ok(response);
    }

}
