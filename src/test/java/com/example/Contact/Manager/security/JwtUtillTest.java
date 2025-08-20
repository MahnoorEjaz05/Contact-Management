package com.example.Contact.Manager.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secretKey", "MySuperSecretKeyMySuperSecretKey"); // 32 chars
        ReflectionTestUtils.setField(jwtUtil, "expirationTime", 1000L * 60 * 60); // 1 hour
        jwtUtil.setupKey();
    }

    @Test
    void generateAndValidateToken() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        String extractedUsername = jwtUtil.extractUsername(token);
        assertEquals(username, extractedUsername);

        assertTrue(jwtUtil.validateToken(token, username));
    }

    @Test
    void tokenExpirationCheck() throws InterruptedException {
        ReflectionTestUtils.setField(jwtUtil, "expirationTime", 1000L); // 1 second
        jwtUtil.setupKey();
        String token = jwtUtil.generateToken("user");

        Thread.sleep(1200);
        assertThrows(RuntimeException.class, () -> jwtUtil.extractUsername(token));
    }
}
