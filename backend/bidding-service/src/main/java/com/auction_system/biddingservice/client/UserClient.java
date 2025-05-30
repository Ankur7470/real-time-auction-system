package com.auction_system.biddingservice.client;

import com.auction_system.biddingservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface UserClient {
    @GetMapping("/api/auth/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @GetMapping("/getUser")
    String getUser(String token);

}
