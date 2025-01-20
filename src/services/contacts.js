import Contact from '../db/models/contact.js';

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const addNewContactService = async (contactData) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const updateContactService = async (contactId, updateData) => {
  const contact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
  });
  return contact;
};

export const deleteContactService = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};
