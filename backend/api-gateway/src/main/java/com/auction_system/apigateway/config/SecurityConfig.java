//package com.auction_system.apigateway.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
//import org.springframework.security.config.web.server.ServerHttpSecurity;
////import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
////import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
//import org.springframework.security.web.server.SecurityWebFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.reactive.CorsConfigurationSource;
//import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//import java.util.Base64;
//import javax.crypto.spec.SecretKeySpec;
//
//@Configuration
//@EnableWebFluxSecurity
//public class SecurityConfig {
//
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    @Bean
//    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
//        return http
//                .csrf(ServerHttpSecurity.CsrfSpec::disable)
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeExchange(exchanges -> exchanges
//                        // Public endpoints
//                        .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register", "/api/auth/test").permitAll()
//                        .pathMatchers(HttpMethod.GET, "/api/auth/test").permitAll()
//                        .pathMatchers(HttpMethod.GET, "/api/auctions", "/api/auctions/{id}").permitAll()
//                        .pathMatchers(HttpMethod.GET, "/api/users/**").permitAll()
//                        .pathMatchers("/api/ws/**").permitAll()
//                        .pathMatchers("/actuator/**").permitAll()
//
//                        // Protected endpoints
//                        .anyExchange().authenticated()
//                )
////                .oauth2ResourceServer(oauth2 -> oauth2
////                        .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
////                )
//                .build();
//    }
//
////    @Bean
////    public ReactiveJwtDecoder jwtDecoder() {
////        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
////        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
////        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
////    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("*"));  // In production, specify exact origins
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList("*"));
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//
//        return source;
//    }
//}
