package com.real_time_auction_system.user_service.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EncryptionService {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public String encode(String password) {
        return passwordEncoder.encode(password);
    }
}
