import httpErrors from 'http-errors';
import {
  getContactById,
  addNewContactService,
  deleteContactService,
  updateContactService,
} from '../services/contacts.js';

import Contact from '../db/models/contact.js';

export const getContacts = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filters = {};
  if (type) filters.contactType = type;
  if (isFavourite) filters.isFavourite = isFavourite === 'true';

  const options = {
    page: parseInt(page),
    limit: parseInt(perPage),
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
  };

  try {
    const contacts = await Contact.paginate(filters, options);
    const response = {
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.docs,
        page: contacts.page,
        perPage: contacts.limit,
        totalItems: contacts.totalDocs,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPrevPage,
        hasNextPage: contacts.hasNextPage,
      },
    };
    res.json(response);
  } catch (error) {
    next(error);
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
    next(httpErrors(500, 'Error creating the contact'));
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
      message: 'Successfully patched a contact!',
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
    next(err.status ? err : httpErrors(500, 'Error deleting the contact'));
  }
};
