const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productImageSchema = new Schema(
  {
    val: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);
const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    actualAmount: {
      type: Number,
      required: true,
    },
    productImage: [productImageSchema],
    // finalAmount: {
    //   type: Number,
    //   required: true,
    // },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    specification: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    productStatus: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    collection: 'products',
    timestamps: true,
    minimize: false,
  },
);

module.exports = mongoose.model('Product', ProductSchema);
