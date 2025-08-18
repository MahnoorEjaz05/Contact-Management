
package com.example.Contact.Manager.controller;

import com.example.Contact.Manager.model.User;
import com.example.Contact.Manager.service.UserService;
import com.example.Contact.Manager.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController // This is essential to handle the API request and response
@RequestMapping("/api/users") // Mapping base URL for all user-related endpoints
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Encrypt the password before storing it
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Save the user
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser); // Return registered user details
        } catch (RuntimeException e) {
            // Handle errors like username already exists
            return ResponseEntity.badRequest().body("Username already exists!");
        }
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findUserByUsername(user.getUsername());

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok("Bearer " + token); // Return JWT token
        }

        // Invalid credentials response
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
