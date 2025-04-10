import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long!',
    'string.max': 'Name must be less than 20 characters!',
    'any.required': 'Name is required!',
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be between 10 and 15 digits, starting with a "+" if applicable!',
      'any.required': 'Phone number is required!',
    }),

  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be a boolean value',
  }),

  contactType: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Contact type must be at least 3 characters long!',
    'string.max': 'Contact type must be less than 20 characters!',
    'any.required': 'Contact type is required!',
  }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name must be at least 3 characters long!',
    'string.max': 'Name must be less than 20 characters!',
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .messages({
      'string.pattern.base':
        'Phone number must be between 10 and 15 digits, starting with a "+" if applicable!',
    }),

  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be a boolean value',
  }),

  contactType: Joi.string().min(3).max(20).messages({
    'string.min': 'Contact type must be at least 3 characters long!',
    'string.max': 'Contact type must be less than 20 characters!',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update the contact!',
  });
