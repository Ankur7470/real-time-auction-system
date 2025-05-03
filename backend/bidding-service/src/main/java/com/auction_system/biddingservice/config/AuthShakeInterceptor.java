package com.auction_system.biddingservice.config;

import com.auction_system.biddingservice.client.UserClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Base64;
import java.util.List;
import java.util.Map;

public class AuthShakeInterceptor implements HandshakeInterceptor {


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        // Allow SockJS transport requests to pass through
        String path = request.getURI().getPath();
        if (path.contains("/info") || path.contains("/iframe") || path.contains("websocket")) {
            return true;
        }

        // Check auth for actual STOMP connection
        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders == null || authHeaders.isEmpty()) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        String token = authHeaders.get(0).replace("Bearer ", "");
        try {
            String username = extractUsernameFromToken(token);
            if (username == null) throw new Exception("Invalid token");
            attributes.put("username", username);
            return true;
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
    }

    private String extractUsernameFromToken(String token) {
        // Simple JWT parsing without validation
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            return new ObjectMapper().readTree(payload).get("sub").asText();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }

}
