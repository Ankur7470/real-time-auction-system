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
@Slf4j
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
        log.debug("Authenticating user: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtHelper.generateJwtToken(authentication);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            log.info("User '{}' authenticated successfully with roles: {}", loginRequest.getUsername(), roles);

            return ResponseEntity.ok(new LoginResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (Exception e) {
            log.error("Login failed for user '{}': {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(new MessageResponse("Invalid username or password"));
        }
    }

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
        log.debug("Registering user: {}", signupRequest.getUsername());

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            log.warn("Username '{}' is already taken", signupRequest.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            log.warn("Email '{}' is already in use", signupRequest.getEmail());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        try {
            User user = new User(signupRequest.getUsername(), signupRequest.getEmail(),
                    encoder.encode(signupRequest.getPassword()));

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

            user.setRoles(roles);
            userRepository.save(user);

            log.info("User '{}' registered successfully", signupRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            log.error("Registration failed for user '{}': {}", signupRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(500).body(new MessageResponse("Registration failed. Please try again."));
        }
    }

    public ResponseEntity<?> verifyUser(String token) {
        log.debug("Verifying token");

        try {
            if (!jwtHelper.validateJwtToken(token)) {
                log.warn("Invalid token received");
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
            }

            String username = jwtHelper.getUserNameFromJwtToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            log.info("Token valid. User '{}' verified", username);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            log.error("Token verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }
    }
}
