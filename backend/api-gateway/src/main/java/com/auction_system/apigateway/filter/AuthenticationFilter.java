//package com.auction_system.apigateway.filter;
//
//import com.auction_system.apigateway.utils.JwtUtil;
//import lombok.Data;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//@Component
//@Slf4j
//public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private RouteValidator routerValidator;
//
//    public AuthenticationFilter() {
//        super(Config.class);
//    }
//
//    @Override
//    public GatewayFilter apply(Config config) {
//        return (exchange, chain) -> {
//            ServerHttpRequest request = exchange.getRequest();
//
//            if (!config.isSecured || !routerValidator.isSecured.test(request)) {
//                return chain.filter(exchange);
//            }
//
//            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
//                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
//            }
//
//            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
//            }
//
//            String token = authHeader.substring(7);
//            try {
//                if (!jwtUtil.validateToken(token)) {
//                    return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
//                }
//
//                String userId = jwtUtil.extractUserId(token);
//                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
//                        .header("X-User-ID", userId)
//                        .build();
//
//                return chain.filter(exchange.mutate().request(modifiedRequest).build());
//            } catch (Exception e) {
//                log.error("Error validating token", e);
//                return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
//            }
//        };
//    }
//
//    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
//        exchange.getResponse().setStatusCode(httpStatus);
//        return exchange.getResponse().setComplete();
//    }
//
//    @Data
//    public static class Config {
//        private boolean isSecured;
//
//        public Config(boolean isSecured) {
//            this.isSecured = isSecured;
//        }
//
//        public Config() {
//        }
//    }
//}
//
