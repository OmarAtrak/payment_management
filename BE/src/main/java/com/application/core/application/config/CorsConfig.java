package com.application.core.application.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addExposedHeader("currentPage");
        config.addExposedHeader("totalItems");
        config.addExposedHeader("totalPages");
        // Define the allowed origins, methods, and headers
        config.addAllowedOrigin("*"); // Replace with the appropriate origin
        config.addAllowedMethod("*"); // Allow all HTTP methods
        config.addAllowedHeader("*"); // Allow all headers

        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}