package com.auction_system.authservice.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SignupResponse {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
