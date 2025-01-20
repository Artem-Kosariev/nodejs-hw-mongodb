import contactSchema from '../validation/contactValidation.js';

export const validateBody = () => {
  return (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};
