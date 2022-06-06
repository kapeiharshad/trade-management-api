const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    collection: 'users',
    timestamps: true,
    minimize: false,
  },
);

UserSchema.index({ email: 1, userName: 1 }, { unique: true });
module.exports = mongoose.model('User', UserSchema);
