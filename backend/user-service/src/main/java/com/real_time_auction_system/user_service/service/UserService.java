package com.real_time_auction_system.user_service.service;

import com.real_time_auction_system.user_service.dto.LoginRequest;
import com.real_time_auction_system.user_service.entity.*;
//import com.real_time_auction_system.user_service.entity.Users;
import com.real_time_auction_system.user_service.exception.UserNotFoundException;
import com.real_time_auction_system.user_service.helper.EncryptionService;
import com.real_time_auction_system.user_service.helper.JWTHelper;
//import com.real_time_auction_system.user_service.repo.UserRepo;
import com.real_time_auction_system.user_service.repo.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import static java.lang.String.format;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    EncryptionService encryptionService;

    @Autowired
    JWTHelper jwtHelper;

    @Autowired
    AuthenticationManager authManager;

    public Users register(Users users) {
        users.setPassword(encryptionService.encode(users.getPassword()));
        return userRepo.save(users);
    }

    public String login(@Valid LoginRequest request) {
        Users user = userRepo.findByEmail(request.email());
        if (user == null) {
            throw new UserNotFoundException(format("Employee with email %s not found", request.email()));
        }

        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        if(auth.isAuthenticated())
            return jwtHelper.generateToken(request.email());

        return "Wrong Username or Password";
    }
}
