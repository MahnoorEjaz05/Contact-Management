package com.example.Contact.Manager.controller;

import com.example.Contact.Manager.model.Contact;
import com.example.Contact.Manager.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Secured - Only authenticated users can view contacts
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    // Secured - Only authenticated users can create contacts
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Contact createContact(@RequestBody Contact contact) {
        return contactService.createContact(contact);
    }

    // Secured - Only authenticated users can update contacts
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public Contact updateContact(@PathVariable Long id, @RequestBody Contact contact) {
        contact.setId(id);
        return contactService.updateContact(contact);
    }

    // Secured - Only authenticated users can delete contacts
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public void deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
    }
}
