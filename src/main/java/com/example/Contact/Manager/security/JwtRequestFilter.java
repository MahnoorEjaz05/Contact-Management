package com.example.Contact.Manager.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil for token validation

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Skip token validation for the /register route
        String uri = request.getRequestURI();
        if (uri.equals("/api/users/register")) {
            filterChain.doFilter(request, response); // Let the registration request pass through without filtering
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Check if the token is in the Authorization header and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7); // Extract token (remove "Bearer ")
            username = jwtUtil.extractUsername(token); // Extract username from the token
        }

        // If the token is valid, set the username in the request
        if (username != null && jwtUtil.validateToken(token, username)) {
            request.setAttribute("username", username); // Set username in request
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
