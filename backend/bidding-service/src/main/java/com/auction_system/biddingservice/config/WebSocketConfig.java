package com.auction_system.biddingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-auction")
                .setAllowedOrigins(Arrays.asList(
                    "http://localhost:5173",
                    "http://192.168.49.2:31000", 
                    "http://frontend-service.auction-system.svc.cluster.local"
                ));
                .addInterceptors(authShakeInterceptor())
                .setHandshakeHandler(new DefaultHandshakeHandler())
                .withSockJS()
                .setSuppressCors(true);
    }

    @Bean
    public AuthShakeInterceptor authShakeInterceptor() {
        return new AuthShakeInterceptor();
    }

    @Bean
    public MappingJackson2MessageConverter messageConverter() {
        return new MappingJackson2MessageConverter();
    }
}
