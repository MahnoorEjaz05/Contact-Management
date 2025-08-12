package com.example.Contact.Manager.utils;

// Custom Exception for Resource Not Found
public class ResourceNotFoundException extends RuntimeException {

    // Constructor to pass the exception message
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
