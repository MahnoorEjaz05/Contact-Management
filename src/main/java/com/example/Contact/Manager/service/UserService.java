package com.example.Contact.Manager.service;

import com.example.Contact.Manager.model.User;
import com.example.Contact.Manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Check if a user with the same username already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists!"); // Or use a custom exception
        }
        return userRepository.save(user); // Save the new user
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
