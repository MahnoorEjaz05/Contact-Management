package com.example.Contact.Manager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.JwtException;

import java.security.Key;
import java.util.Date;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    // Secret key for JWT generation (must be at least 256 bits for HMAC-SHA256)
    @Value("${jwt.secret}")
    private String secretKey;

    @PostConstruct
    public void init() {
        System.out.println("JWT Secret: " + secretKey); // This will print the JWT secret to the console
    }

    @Value("${jwt.expiration-time}") // Inject expiration time from application.properties
    private long expirationTime;

    // Use the secret key to create a secure 256-bit key for HMAC-SHA256
    private Key key;

    @PostConstruct
    public void setupKey() {
        // Generate a secure key using the provided secret, ensuring it's 256 bits (32
        // bytes)
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Generate JWT token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Dynamic expiration time
                .signWith(key, SignatureAlgorithm.HS256) // Use the secure key for signing
                .compact();
    }

    // Extract username from JWT token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Validate the token
    public boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);
        return (username.equals(extractedUsername) && !isTokenExpired(token));
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from the token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract claims from the token
    private <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key) // Use the secure 256-bit key
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            // Handle invalid token
            throw new RuntimeException("Invalid or expired token", e);
        }
    }

    // Functional interface for extracting claims
    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}
