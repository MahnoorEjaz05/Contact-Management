package com.example.Contact.Manager.service;

import com.example.Contact.Manager.model.User;
import com.example.Contact.Manager.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService { // Implement UserDetailsService

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------- REGISTER --------------------
    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists!");
        }
        // ✅ Only encode here (controller should NOT encode)
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // -------------------- FIND USER --------------------
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // -------------------- UPDATE USER --------------------
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // -------------------- CHANGE PASSWORD --------------------
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username);
        if (user == null)
            return false;

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        // ✅ Encode new password before saving
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    // -------------------- SPRING SECURITY --------------------
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("User not found: " + username);

        // ✅ Provide Spring Security with encoded password
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // Authorities/roles, empty for now
        );
    }
}
