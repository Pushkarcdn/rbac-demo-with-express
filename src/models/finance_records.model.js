import mongoose from "mongoose";

const financeRecordSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

const Finance_Records =
  mongoose.models.Finance_Records ||
  mongoose.model("Finance_Records", financeRecordSchema);

export default Finance_Records;
