const mongoose = require("mongoose");

// Sub-schema for status history audit trail
//sub schema for status history audit trail
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "assigned", "contacted", "converted", "rejected"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Can be User (admin/affiliate) or Business — we store both
    },
    changedByModel: {
      type: String,
      enum: ["User", "Business"],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note must not exceed 500 characters"],
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const referralSchema = new mongoose.Schema(
  {
    // ── Parties ────────────────────────────────────────────
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Submitter (affiliate) is required"],
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
      index: true,
    },

   //lead info
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address must not exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description must not exceed 1000 characters"],
    },
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sector",
      required: [true, "Sector is required"],
      index: true,
    },

    // status
    status: {
      type: String,
      enum: ["pending", "assigned", "contacted", "converted", "rejected"],
      default: "pending",
      index: true,
    },
    statusHistory: [statusHistorySchema],

    // credits
    totalCredits: {
      type: Number,
      required: true,
      min: [0, "Credits cannot be negative"],
    },
    creditStatus: {
      type: String,
      enum: ["escrow", "released", "cancelled"],
      default: "escrow",
      index: true,
    },

    // admin notes
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Admin notes must not exceed 500 characters"],
    },

    //timestamps for key events
    assignedAt: { type: Date },
    convertedAt: { type: Date },
    rejectedAt: { type: Date },
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

// compound indexes
referralSchema.index({ submittedBy: 1, status: 1 });
referralSchema.index({ assignedTo: 1, status: 1 });
referralSchema.index({ createdAt: -1 });

const Referral = mongoose.model("Referral", referralSchema);
module.exports = Referral;
