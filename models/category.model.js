const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    categoryUniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    categoryStatus: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    collection: 'categories',
    timestamps: true,
    minimize: false,
  },
);

module.exports = mongoose.model('Category', CategorySchema);
