import Joi from 'joi';

const idSchema = Joi.object({
  contactId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const isValidId = (req, res, next) => {
  const { error } = idSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: 'Wrong format ID' });
  }
  next();
};
