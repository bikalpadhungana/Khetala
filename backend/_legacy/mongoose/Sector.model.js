const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sector name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Sector name must be at least 2 characters"],
      maxlength: [100, "Sector name must not exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description must not exceed 300 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Sector = mongoose.model("Sector", sectorSchema);
module.exports = Sector;
