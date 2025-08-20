package com.example.Contact.Manager.service;

import com.example.Contact.Manager.model.Contact;
import com.example.Contact.Manager.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContactServiceTest {

    private ContactRepository contactRepository;
    private ContactService contactService;

    @BeforeEach
    void setUp() {
        contactRepository = Mockito.mock(ContactRepository.class); // pure mock
        contactService = new ContactService();
        contactService = spy(contactService); // optional if you want spy
        // inject mock manually
        contactService.getClass().getDeclaredFields();
        try {
            var field = ContactService.class.getDeclaredField("contactRepository");
            field.setAccessible(true);
            field.set(contactService, contactRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void getAllContacts_shouldReturnList() {
        List<Contact> mockList = List.of(new Contact(), new Contact());
        when(contactRepository.findAll()).thenReturn(mockList);

        List<Contact> result = contactService.getAllContacts();
        assertEquals(2, result.size());
        verify(contactRepository, times(1)).findAll();
    }

    @Test
    void createContact_shouldSaveAndReturn() {
        Contact contact = new Contact();
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        Contact result = contactService.createContact(contact);
        assertNotNull(result);
        verify(contactRepository, times(1)).save(contact);
    }

    @Test
    void updateContact_shouldSaveAndReturn() {
        Contact contact = new Contact();
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        Contact result = contactService.updateContact(contact);
        assertNotNull(result);
        verify(contactRepository, times(1)).save(contact);
    }

    @Test
    void deleteContact_shouldCallRepository() {
        Long id = 1L;
        doNothing().when(contactRepository).deleteById(id);

        contactService.deleteContact(id);
        verify(contactRepository, times(1)).deleteById(id);
    }
}
