package com.auction_system.common.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;

//@Component
//public class FeignClientInterceptor implements RequestInterceptor {
//    @Override
//    public void apply(RequestTemplate template) {
//        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        if (attrs != null) {
//            HttpServletRequest request = attrs.getRequest();
//            String auth = request.getHeader("Authorization");
//            if (auth != null) {
//                template.header("Authorization", auth);
//            }
//        }
//    }
//}
@Component
public class FeignClientInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String USER_ID_HEADER = "X-User-ID";

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes != null) {
            HttpServletRequest request = requestAttributes.getRequest();

            // Forward Authorization header if present
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && !authorizationHeader.isEmpty()) {
                template.header("Authorization", authorizationHeader);
            }

            // Forward X-User-ID header if present
            String userIdHeader = request.getHeader("X-User-ID");
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                template.header("X-User-ID", userIdHeader);
            }

            // Log headers for debugging
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                String headerValue = request.getHeader(headerName);
                System.out.println("Header: " + headerName + " = " + headerValue);
            }
        }
    }
}
