import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  isFavourite: { type: Boolean, default: false },
  contactType: { type: String, required: true },
});

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
