package com.resume.tracker.security;

import com.resume.tracker.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // =====================================================
        // CORS PREFLIGHT
        // =====================================================

        /*
         * Browser sends OPTIONS before requests such as:
         *
         * DELETE /api/resumes/1
         * GET    /api/dashboard
         *
         * Do NOT try to authenticate the OPTIONS request.
         */
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {

            filterChain.doFilter(request, response);

            return;
        }

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader("Authorization");

        /*
         * No Authorization header.
         *
         * This is completely valid for:
         *
         * /api/auth/login
         * /api/auth/register
         * /r/{slug}
         *
         * Spring Security will decide later whether the
         * endpoint requires authentication.
         */
        if (authHeader == null ||
                authHeader.trim().isEmpty()) {

            filterChain.doFilter(request, response);

            return;
        }

        // =====================================================
        // CHECK BEARER FORMAT
        // =====================================================

        if (!authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            return;
        }

        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        String token =
                authHeader.substring(7).trim();

        if (token.isEmpty()) {

            filterChain.doFilter(request, response);

            return;
        }

        // =====================================================
        // VALIDATE TOKEN
        // =====================================================

        try {

            if (jwtService.isTokenValid(token)) {

                String username =
                        jwtService.extractUsername(token);

                // -------------------------------------------------
                // MAKE SURE USERNAME EXISTS
                // -------------------------------------------------

                if (username != null &&
                        !username.trim().isEmpty()) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.emptyList()
                            );

                    // -------------------------------------------------
                    // SET AUTHENTICATION
                    // -------------------------------------------------

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            /*
             * Never let a bad JWT crash the request/filter chain.
             *
             * The request will continue without authentication.
             * Spring Security will then return 401/403 if the
             * requested endpoint requires authentication.
             */
            SecurityContextHolder
                    .clearContext();
        }

        // =====================================================
        // CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(request, response);
    }
}