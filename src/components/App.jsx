import { useEffect, useState } from 'react';
import { Container } from './AppStyled';
import { FormRegistration } from './FormRegistration/FormRegistration';
import { ContactsList } from './ContactsList/ContactsList';
import { Filter } from './Filter/Filter';
import { Notify } from 'notiflix';

export const App = () => {
  const [filter, setFilter] = useState('');
  const [contacts, setContacts] = useState([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ]);
  
  useEffect(() => {
    const localData = localStorage.getItem('contacts');
    if (localData) {
      setContacts(JSON.parse(localData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    return () => {
      localStorage.removeItem('contacts');
    };
  }, [contacts]);

  const addContactData = newContact => {
    const isTrue = contacts.some(({ name }) => name === newContact.name);
    if (isTrue) {
      Notify.failure(`${newContact.name} is already in contacts`);
      return;
    }
    setContacts(preContacts => [newContact, ...preContacts]);
  };

  const removeContact = id => {
    setContacts(preContacts =>
      preContacts.filter(contact => contact.id !== id)
    );
  };

  const getFilterContacts = () => {
    if (filter === '') {
      return contacts;
    }
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase().trim())
    );
  };

  const getFilterData = ({ target: { value } }) => {
    setFilter(value);
  };

  const contactsArray = getFilterContacts();
  return (
    <Container>
      <h1 className="title">Phonebook</h1>
      <section className="contact-registration">
        <FormRegistration addContactData={addContactData} />
      </section>
      <section className="contacts">
        <h2 className="contacts-title">Contacts</h2>
        {contacts.length > 0 ? (
          <Filter filter={filter} getFilterData={getFilterData} />
        ) : (
          Notify.failure('Your phonebook is empty. Add first contact!')
        )}
        <ContactsList contacts={contactsArray} removeContact={removeContact} />
      </section>
    </Container>
  );
};
