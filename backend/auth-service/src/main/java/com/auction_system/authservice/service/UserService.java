package com.auction_system.authservice.service;

import com.auction_system.authservice.model.User;
import com.auction_system.authservice.payload.UserDto;
import com.auction_system.authservice.repo.UserRepo;
import com.auction_system.authservice.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    public UserDto getUserById(Long id) {

        User user = userRepo.findById(id).orElse(null);
        assert user != null;
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getUsername()
        );
    }

//        public User getAuthenticatedUser() {
//
//
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated()) {
//            throw new RuntimeException("Not authenticated");
//        }
//
//        // Get user details from authentication object
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//
//        // Return the user entity from database
//        return userRepo.findByUsername(userDetails.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//    }
}
