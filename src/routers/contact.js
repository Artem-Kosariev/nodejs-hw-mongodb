import express from 'express';
import multer from 'multer';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';

import { authenticate } from '../middlewares/authenticate.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('photo');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post(
  '/',
  upload,
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  upload,
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContact),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
