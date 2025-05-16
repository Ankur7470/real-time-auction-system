package com.auction_system.apigateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOriginPattern("http://localhost:5173");
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addExposedHeader("Authorization"); // Important for WebSocket auth
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L); // Cache OPTIONS preflight for 1 hour

        // Special WebSocket headers
        corsConfig.addAllowedHeader("Upgrade");
        corsConfig.addAllowedHeader("Connection");
        corsConfig.addAllowedHeader("Sec-WebSocket-Version");
        corsConfig.addAllowedHeader("Sec-WebSocket-Key");
        corsConfig.addAllowedHeader("Sec-WebSocket-Extensions");
        corsConfig.addAllowedHeader("Sec-WebSocket-Protocol");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsWebFilter(source);
    }
}