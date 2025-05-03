package com.auction_system.authservice.service;

import com.auction_system.authservice.model.ERole;
import com.auction_system.authservice.model.Role;
import com.auction_system.authservice.model.User;
import com.auction_system.authservice.payload.request.LoginRequest;
import com.auction_system.authservice.payload.request.SignupRequest;
import com.auction_system.authservice.payload.response.LoginResponse;
import com.auction_system.authservice.payload.response.MessageResponse;
import com.auction_system.authservice.repo.RoleRepo;
import com.auction_system.authservice.repo.UserRepo;
//import com.auction_system.authservice.security.jwt.JwtHelper;
import com.auction_system.authservice.security.jwt.JwtUtils;
import com.auction_system.authservice.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepository;

    @Autowired
    RoleRepo roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtHelper;

    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtHelper.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new LoginResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signupRequest.getUsername(), signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

//    public boolean validateToken(String token) {
//        return jwtHelper.validateJwtToken(token);
//    }

    public ResponseEntity<?> verifyUser(String token) {

        try {
            if (!jwtHelper.validateJwtToken(token)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
            }

            String username = jwtHelper.getUserNameFromJwtToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }
    }


    public ResponseEntity<?> getUser(String token) {
        try {
            if (!jwtHelper.validateJwtToken(token)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
            }

            String username = jwtHelper.getUserNameFromJwtToken(token);
            return ResponseEntity.ok(username);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }
    }
}
