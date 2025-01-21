import {
  getContactById,
  addNewContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';
import httpErrors from 'http-errors';
import Contact from '../db/models/contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    const contacts = await Contact.paginate(
      { userId: req.user.userId },
      {
        page: parseInt(page),
        limit: parseInt(perPage),
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
      },
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.docs,
        totalItems: contacts.totalDocs,
        totalPages: contacts.totalPages,
        page: contacts.page,
        perPage: contacts.limit,
        hasNextPage: contacts.hasNextPage,
        hasPrevPage: contacts.hasPrevPage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user.userId);

    if (!contact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
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
      userId: req.user.userId,
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
    const updatedContact = await updateContactService(
      req.params.contactId,
      req.body,
      req.user.userId,
    );

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
    const deletedContact = await deleteContactService(
      req.params.contactId,
      req.user.userId,
    );

    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
