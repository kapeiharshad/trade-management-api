const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['accessToken', 'refershToken', 'randToken'],
      required: true,
    },
  },
  {
    collection: 'user_token',
    timestamps: true,
    minimize: false,
  },
);

UserTokenSchema.index({ userId: 1 });
module.exports = mongoose.model('UserToken', UserTokenSchema);
