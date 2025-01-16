import {
  getAllContacts,
  getContactById,
  addNewContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';
import httpErrors from 'http-errors';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched contacts!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched the contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const newContact = await addNewContactService({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const updatedContact = await updateContactService(contactId, {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    if (!updatedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await deleteContactService(contactId);

    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
