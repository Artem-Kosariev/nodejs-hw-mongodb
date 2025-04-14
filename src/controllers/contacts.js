import {
  getContactById,
  addNewContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';
import httpErrors from 'http-errors';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Contact from '../db/models/contact.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !email) {
      throw httpErrors(400, 'Name, phone number, and email are required');
    }

    let photoUrl = null;

    if (req.file) {
      try {
        console.log('File received for upload:', req.file);

        const result = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ resource_type: 'auto' }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });

        photoUrl = result.secure_url;
        console.log('Uploaded photo URL:', photoUrl);
      } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        throw httpErrors(500, 'Failed to upload photo to Cloudinary');
      }
    }

    console.log('Saving photo URL to database:', photoUrl);

    const newContact = await addNewContactService({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user.userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    console.error('Error creating contact:', err);
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    let photoUrl = null;

    const contact = await getContactById(req.params.contactId, req.user.userId);
    if (!contact) {
      throw httpErrors(404, 'Contact not found');
    }

    if (req.file) {
      console.log('File received for upload:', req.file);

      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ resource_type: 'auto' }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(req.file.buffer);
        });

        if (result && result.secure_url) {
          photoUrl = result.secure_url;
          console.log('Photo uploaded successfully:', photoUrl);
        } else {
          throw new Error('Cloudinary did not return a valid URL');
        }
      } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        throw httpErrors(500, 'Failed to upload photo to Cloudinary');
      }
    } else {
      photoUrl = contact.photo;
    }

    const updatedContact = await updateContactService(
      req.params.contactId,
      {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        photo: photoUrl,
      },
      req.user.userId,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      isFavourite,
    } = req.query;

    const filter = {
      userId: req.user.userId,
    };
    if (typeof isFavourite !== 'undefined') {
      filter.isFavourite = isFavourite === 'true';
    }
    const contacts = await Contact.paginate(filter, {
      page: Math.max(1, parseInt(page)),
      limit: Math.max(1, parseInt(perPage)),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    });

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
      message: 'Successfully found contact!',
      data: contact,
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
