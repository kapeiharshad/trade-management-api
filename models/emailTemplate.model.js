const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailTemplateSchema = new Schema(
  {
    subject: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['forgotPassword'],
      required: true,
    },
  },
  {
    collection: 'email_template',
    timestamps: true,
    minimize: false,
  },
);

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
