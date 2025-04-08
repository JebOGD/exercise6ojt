import ContactsModel from '../models/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactsModel.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    console.log('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // VALIDATE
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = await ContactsModel.create({ name, phone, email });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const [updated] = await ContactsModel.update(
      { name, phone, email, updatedAt: new Date() }, 
      { where: { _id: id } } 
    );

    if (updated) {
      const updatedContact = await ContactsModel.findOne({ where: { _id: id } });
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactsModel.destroy({ where: { _id: id } }); 
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
