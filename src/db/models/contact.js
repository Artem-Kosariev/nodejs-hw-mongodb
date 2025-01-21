import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const contactSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
    isFavourite: Boolean,
    contactType: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
