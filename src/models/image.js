const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
