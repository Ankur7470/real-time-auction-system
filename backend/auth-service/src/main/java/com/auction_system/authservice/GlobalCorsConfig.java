//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class GlobalCorsConfig {
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("*") // Temporarily allow all
//                        // .allowedOrigins(
//                        //     "http://localhost:5173",
//                        //     "http://192.168.49.2:31000",
//                        //     "http://frontend-service.auction-system.svc.cluster.local"
//                        // )
//                        .allowedMethods("*")
//                        .allowedHeaders("*")
//                        .exposedHeaders("Authorization")
//                        .allowCredentials(true);
//            }
//        };
//    }
//}
//
