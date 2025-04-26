////package com.auction_system.apigateway.config;
////
////import com.auction_system.apigateway.filter.AuthenticationFilter;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.cloud.gateway.route.RouteLocator;
////import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////
////@Configuration
////public class GatewayConfig {
////
////    @Autowired
////    private AuthenticationFilter authenticationFilter;
////
////    @Bean
////    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
////        return builder.routes()
////                .route("auth-service", r -> r
////                        .path("/api/auth/**")
////                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config(false))))
////                        .uri("lb://auth-service"))
////                .route("auction-service", r -> r
////                        .path("/api/auctions/**")
////                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config(true))))
////                        .uri("lb://auction-service"))
////                .route("bidding-service", r -> r
////                        .path("/api/bids/**")
////                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config(true))))
////                        .uri("lb://bidding-service"))
////                .route("notification-service-ws", r -> r
////                        .path("/api/ws/**")
////                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config(false))))
////                        .uri("lb://notification-service"))
////                .route("notification-service", r -> r
////                        .path("/api/notifications/**")
////                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config(true))))
////                        .uri("lb://notification-service"))
////                .build();
////    }
////}
//package com.auction_system.apigateway.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.route.RouteLocator;
//import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import com.auction_system.apigateway.filter.AuthenticationFilter;
//
//@Configuration
//public class GatewayConfig {
//
//    @Autowired
//    private AuthenticationFilter authFilter;
//
//    @Bean
//    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
//        return builder.routes()
//                // Public routes - no authentication required
//                .route("auth-public", r -> r
//                        .path("/api/auth/login", "/api/auth/register", "/api/auth/token", "/api/auth/validate", "/api/auth/test")
//                        .uri("lb://auth-service"))
//                .route("auctions-public", r -> r
////                        .method(HttpMethod.GET)
//                        .path("/api/auctions", "/api/auctions/{id}")
//                        .uri("lb://auction-service"))
//                .route("websocket", r -> r
//                        .path("/api/ws/**")
//                        .uri("lb://notification-service"))
//
//                // Protected routes - authentication required
//                .route("auth-protected", r -> r
//                        .path("/api/auth/**")
//                        .filters(f -> f.filter(authFilter))
//                        .uri("lb://auth-service"))
//                .route("auctions-protected", r -> r
//                        .path("/api/auctions/**")
//                        .filters(f -> f.filter(authFilter))
//                        .uri("lb://auction-service"))
//                .route("bids", r -> r
//                        .path("/api/bids/**")
//                        .filters(f -> f.filter(authFilter))
//                        .uri("lb://bidding-service"))
//                .route("notifications", r -> r
//                        .path("/api/notifications/**")
//                        .filters(f -> f.filter(authFilter))
//                        .uri("lb://notification-service"))
//                .build();
//    }
//}
