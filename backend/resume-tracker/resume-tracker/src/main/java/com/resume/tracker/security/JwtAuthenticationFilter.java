// package com.resume.tracker.security;

// import com.resume.tracker.service.JwtService;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.Collections;

// @Component
// public class JwtAuthenticationFilter
//         extends OncePerRequestFilter {

//     private final JwtService jwtService;

//     public JwtAuthenticationFilter(JwtService jwtService) {
//         this.jwtService = jwtService;
//     }

//     @Override
//     protected void doFilterInternal(
//             HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain)
//             throws ServletException, IOException {

//         String authHeader =
//                 request.getHeader("Authorization");

//         if (authHeader == null ||
//                 !authHeader.startsWith("Bearer ")) {

//             filterChain.doFilter(request, response);
//             return;
//         }

//         String token =
//                 authHeader.substring(7);

//         if (jwtService.isTokenValid(token)) {

//             String username =
//                     jwtService.extractUsername(token);

//             UsernamePasswordAuthenticationToken authentication =
//                     new UsernamePasswordAuthenticationToken(
//                             username,
//                             null,
//                             Collections.emptyList()
//                     );

//             SecurityContextHolder
//                     .getContext()
//                     .setAuthentication(authentication);
//         }

//         filterChain.doFilter(request, response);
//     }
// }


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
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =====================================================
        // ALLOW CORS PREFLIGHT REQUEST
        // =====================================================

        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod())) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader(
                        "Authorization"
                );

        // =====================================================
        // NO JWT
        // =====================================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        String token =
                authHeader.substring(7);

        // =====================================================
        // VALIDATE TOKEN
        // =====================================================

        if (jwtService.isTokenValid(token)) {

            String username =
                    jwtService.extractUsername(
                            token
                    );

            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );
        }

        // =====================================================
        // CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}
