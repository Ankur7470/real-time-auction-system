package com.real_time_auction_system.user_service.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper=true)
@Data
public class UserNotFoundException extends RuntimeException {
    private final String msg;
}
