package com.auction_system.common.feign;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class FeignErrorDecoder implements ErrorDecoder {
    private static final Logger logger = LoggerFactory.getLogger(FeignErrorDecoder.class);
    private final ErrorDecoder defaultErrorDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        logger.error("Error occurred while using Feign client. Status code: {}", response.status());

        if (response.status() == 401) {
            return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed when communicating with service");
        }

        if (response.status() == 404) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
        }

        if (response.status() == 503) {
            return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Service is currently unavailable");
        }

        return defaultErrorDecoder.decode(methodKey, response);
    }
}
