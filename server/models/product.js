const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: "true",
  },
  //Slug: Apple Watch => apple-watch
  slug: {
    type: String,
    require: true,
    // unique: true,
    lowercase: true,
  },
  description: {
    type: Array,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String
  },
  quantity: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  image: {
    type: Array,
  },
  color: {
    type: String,
    require: true
  },
  ratings: [
    {
      star: { type: Number },
      postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
  totalRatings: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

//Export the model
module.exports = mongoose.model("Product", productSchema);
