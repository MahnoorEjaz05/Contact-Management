package com.example.Contact.Manager.repository;

import com.example.Contact.Manager.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
