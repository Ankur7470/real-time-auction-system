package com.auction_system.authservice.service;

import com.auction_system.authservice.model.User;
import com.auction_system.authservice.payload.UserDto;
import com.auction_system.authservice.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
}
