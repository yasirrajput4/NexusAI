import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "model", "error"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { _id: false }
);

const threadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Thread", threadSchema);
