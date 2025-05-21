package com.auction_system.apigateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://192.168.49.2:31000", 
            "http://frontend-service.auction-system.svc.cluster.local"
        ));

        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addExposedHeader("Authorization");
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L); 

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