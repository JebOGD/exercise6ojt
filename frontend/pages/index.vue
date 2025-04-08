<template>
  <div id="app">
    <a-layout>
      <a-layout-header class="header" style="height: 150px; display: flex; align-items: center; justify-content: center; background-color: #636363;">
        <h1 style="color: white; font-size: 50px">Contact Manager</h1>
      </a-layout-header>
      <a-layout-content class="content">
        <a-form @submit.prevent="addOrUpdateContact" layout="vertical" class="form">
          <a-form-item label="Name" required>
            <a-input v-model:value="newContact.name" placeholder="Enter name" />
          </a-form-item>
          <a-form-item label="Phone" required >
            <a-input v-model:value="newContact.phone" maxlength="11" placeholder="Enter phone"/>
            <span v-if="phoneError" style="color: red;">{{ phoneError }}</span>
          </a-form-item>
          <a-form-item label="Email" required>
            <a-input v-model:value="newContact.email" maxlength="50" placeholder="Enter email" />
            <span v-if="emailError" style="color: red;">{{ emailError }}</span>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              {{ isEditing ? "Update Contact" : "Add Contact" }}
            </a-button>
            <a-button v-if="isEditing" @click="cancelEdit" style="margin-left: 8px">
              Cancel
            </a-button>
          </a-form-item>
        </a-form>
        <a-table :data-source="contacts" :columns="columns" row-key="_id" bordered>
          <template #bodyCell="{ text, record, column }">
            <span v-if="column.key !== 'actions'">{{ text }}</span>
            <template v-else>
              <a-button type="link" @click="editContact(record)">Edit</a-button>
              <a-button type="link" danger @click="deleteContact(record._id)">Delete</a-button>
            </template>
          </template>
        </a-table>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const contacts = ref([]);
const newContact = reactive({ name: '', phone: '', email: '' });
const isEditing = ref(false);
const editingContactId = ref(null);
const phoneError = ref('');
const emailError = ref('');

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Actions', key: 'actions' },
];

const fetchContacts = async () => {
  try {
    const data = await $fetch('http://localhost:4000/api/contacts');
    contacts.value = data;
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    message.error('Failed to fetch contacts. Please check the backend server.');
  }
};

const validatePhone = (phone) => {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return emailRegex.test(email);
};

const addOrUpdateContact = async () => {
  phoneError.value = '';
  emailError.value = '';

  if (!validatePhone(newContact.phone)) {
    phoneError.value = 'Phone number must start with 09 and have 11 digits.';
    return;
  }

  if (!validateEmail(newContact.email)) {
    emailError.value = 'Email must contain "@" and end with ".com".';
    return;
  }

  newContact.email = newContact.email.toLowerCase(); // lowercase email

  try {
    if (isEditing.value) {
      await $fetch(`http://localhost:4000/api/contacts/${editingContactId.value}`, {
        method: 'PUT',
        body: newContact,
      });
      isEditing.value = false;
      editingContactId.value = null;
    } else {
      await $fetch('http://localhost:4000/api/contacts', {
        method: 'POST',
        body: newContact,
      });
    }
    Object.assign(newContact, { name: '', phone: '', email: '' });
    fetchContacts();
    message.success(isEditing.value ? 'Contact updated successfully!' : 'Contact added successfully!');
  } catch (error) {
    console.error('Error adding/updating contact:', error.message);
    message.error('Failed to add/update contact.');
  }
};

const editContact = (contact) => {
  Object.assign(newContact, contact);
  isEditing.value = true;
  editingContactId.value = contact._id;
};

const cancelEdit = () => {
  Object.assign(newContact, { name: '', phone: '', email: '' });
  isEditing.value = false;
  editingContactId.value = null;
};

const deleteContact = async (id) => {
  try {
    await $fetch(`http://localhost:4000/api/contacts/${id}`, {
      method: 'DELETE',
    });
    fetchContacts();
    message.success('Contact deleted successfully!');
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    message.error('Failed to delete contact.');
  }
};

onMounted(fetchContacts);
</script>
