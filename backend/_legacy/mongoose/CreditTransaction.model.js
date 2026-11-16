const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: [true, "Referral is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["escrow", "release", "cancel"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must not exceed 200 characters"],
    },
    // Snapshot of balances after this transaction
    // snapshot of balances after this transaction
    // snapshot of balances after this transaction
    
    balanceAfter: {
      availableCredits: { type: Number },
      escrowCredits: { type: Number },
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

// ── Indexes ──────────────────────────────────────────────────
creditTransactionSchema.index({ user: 1, createdAt: -1 });
creditTransactionSchema.index({ referral: 1, type: 1 });

const CreditTransaction = mongoose.model("CreditTransaction", creditTransactionSchema);
module.exports = CreditTransaction;
