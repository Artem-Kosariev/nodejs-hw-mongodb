import Contact from '../db/models/contact.js';

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (err) {
    throw new Error('Error retrieving contact');
  }
};

export const addNewContactService = async (contactData) => {
  try {
    const contact = new Contact({
      ...contactData,
      userId: contactData.userId,
    });

    await contact.save();
    return contact;
  } catch (err) {
    throw new Error('Error creating new contact');
  }
};

export const updateContactService = async (contactId, updateData, userId) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updateData,
      { new: true },
    );
    if (!contact) {
      throw new Error('Contact not found for update');
    }
    return contact;
  } catch (err) {
    throw new Error('Error updating contact');
  }
};

export const deleteContactService = async (contactId, userId) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    if (!contact) {
      throw new Error('Contact not found for deletion');
    }
    return contact;
  } catch (err) {
    throw new Error('Error deleting contact');
  }
};
