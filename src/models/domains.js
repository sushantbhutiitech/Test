const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   // unique: true,
    // },
    name: {
      type: String,
      required: true,
      trim: true,
      // unique: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Domain = mongoose.model("Domain", domainSchema);
// Ensure the unique index is created
Domain.createIndexes();

module.exports = {
  domainSchema,
  Domain,
};
