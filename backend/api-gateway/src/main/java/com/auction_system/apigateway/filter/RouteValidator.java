//package com.auction_system.apigateway.filter;
//
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//import java.util.function.Predicate;
//
//@Component
//public class RouteValidator {
//
//    public final Predicate<ServerHttpRequest> isSecured =
//            request -> {
//                List<String> securedEndpoints = List.of(
//                        "/api/auctions/create",
//                        "/api/auctions/*/bid",
//                        "/api/bids/**",
//                        "/api/notifications/**"
//                );
//                return securedEndpoints.stream()
//                        .anyMatch(uri -> request.getURI().getPath().contains(uri));
//            };
//}
//
