package com.example.Contact.Manager.utils;

public class ValidationException extends RuntimeException {

    // Constructor to pass the validation exception message
    public ValidationException(String message) {
        super(message);
    }
}
