package com.auction_system.authservice.controller;

import com.auction_system.authservice.payload.request.LoginRequest;
import com.auction_system.authservice.payload.request.SignupRequest;
import com.auction_system.authservice.repo.UserRepo;
import com.auction_system.authservice.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepo;

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
//
//    @GetMapping("/verify")
//    public ResponseEntity<?> validateToken(@RequestParam String token) {
//
//
//        boolean isValid = authService.validateToken(token);
//
//        if (!isValid) {
////            System.out.println("Invalid Token");
//            throw new RuntimeException("Invalid token new");
////            return ResponseEntity.ok(new MessageResponse("Invalid Token"));
//        }
//
//        Map<String, Boolean> response = new HashMap<>();
//        response.put("valid", isValid);
//
//        return ResponseEntity.ok(response);
//    }

@GetMapping("/verify")
public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
    }

    String token = authHeader.substring(7);

     return ResponseEntity.ok(authService.verifyUser(token));
}



}

