package com.auction_system.authservice.controller;

import com.auction_system.authservice.payload.request.LoginRequest;
import com.auction_system.authservice.payload.request.SignupRequest;
import com.auction_system.authservice.payload.response.MessageResponse;
import com.auction_system.authservice.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    AuthenticationManager authenticationManager;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Hello World");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.registerUser(signUpRequest);
    }

//    @PostMapping("/token")
//    public ResponseEntity<?> generateToken(@RequestParam String username) {
//
//        String token = authService.generateToken(username);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("token", token);
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/validate")
//    public ResponseEntity<?> validateToken(@RequestParam String token) {
//
//        boolean isValid = authService.validateToken(token);
//
//        Map<String, Boolean> response = new HashMap<>();
//        response.put("valid", isValid);
//
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/me")
//    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
//        log.info("Request to get current user details");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            return authService.getUserFromToken(token);
//        }
//
//        return ResponseEntity.badRequest().body(new MessageResponse("Invalid authorization header"));
//    }


}

