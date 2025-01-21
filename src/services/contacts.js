import Contact from '../db/models/contact.js';

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const addNewContactService = async (contactData) => {
  const contact = new Contact({
    ...contactData,
    userId: contactData.userId,
  });

  await contact.save();
  return contact;
};

export const updateContactService = async (contactId, updateData, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
  return contact;
};

export const deleteContactService = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
