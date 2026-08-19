package com.resume.tracker.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.resume.tracker.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final String frontendUrl;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            @Value("${FRONTEND_URL:http://localhost:5173}")
            String frontendUrl) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;

        this.frontendUrl = frontendUrl
                .trim()
                .replaceAll("/+$", "");
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        /*
         * Production Vercel frontend:
         *
         * https://resume-tracker-delta.vercel.app
         *
         * Local frontend:
         *
         * http://localhost:5173
         */

        List<String> allowedOrigins =
                new ArrayList<>();

        allowedOrigins.add(
                frontendUrl
        );

        /*
         * Always allow local development.
         */
        if (!allowedOrigins.contains(
                "http://localhost:5173")) {

            allowedOrigins.add(
                    "http://localhost:5173"
            );
        }

        configuration.setAllowedOrigins(
                allowedOrigins
        );

        // -------------------------------------------------------
        // ALLOWED METHODS
        // -------------------------------------------------------

        configuration.setAllowedMethods(
                List.of(
                        HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.PATCH.name(),
                        HttpMethod.DELETE.name(),
                        HttpMethod.OPTIONS.name()
                )
        );

        // -------------------------------------------------------
        // ALLOWED HEADERS
        // -------------------------------------------------------

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );

        // -------------------------------------------------------
        // EXPOSED HEADERS
        // -------------------------------------------------------

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        /*
         * Your frontend sends Authorization: Bearer ...
         *
         * Credentials must therefore be enabled if your
         * frontend/backend configuration requires them.
         */
        configuration.setAllowCredentials(true);

        /*
         * Cache preflight response for 1 hour.
         */
        configuration.setMaxAge(3600L);

        // -------------------------------------------------------
        // REGISTER CORS CONFIGURATION
        // -------------------------------------------------------

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(csrf ->
                        csrf.disable()
                )

                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // -------------------------------------------------
                // SESSION
                // -------------------------------------------------

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(auth -> auth

                        /*
                         * VERY IMPORTANT:
                         *
                         * Allow browser CORS preflight requests.
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        /*
                         * Login / Register
                         */
                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()

                        /*
                         * Public resume
                         */
                        .requestMatchers(
                                "/r/**"
                        )
                        .permitAll()

                        /*
                         * Everything else requires JWT.
                         */
                        .anyRequest()
                        .authenticated()
                )

                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
