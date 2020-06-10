const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  ],
  restaurantName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  facebook: { type: String },
  youtube: { type: String },
  instagram: { type: String },
  twitter: { type: String },
});
schema.plugin(uniqueValidator);

module.exports = mongoose.model("User", schema);
