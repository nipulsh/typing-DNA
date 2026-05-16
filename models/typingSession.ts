import mongoose, { Schema, models, model } from "mongoose";

const keystrokeEventSchema = new Schema(
  {
    at: { type: Date, required: true },
    key: { type: String, required: true },
    expectedChar: { type: String, default: null },
    matched: { type: Boolean, default: null },
    position: { type: Number, required: true },
  },
  { _id: false },
);

const typingSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    events: { type: [keystrokeEventSchema], default: [] },
    endedAt: { type: Date, default: null },
    clientUserAgent: { type: String, default: null },
  },
  { timestamps: true },
);

const TypingSession =
  models.TypingSession || model("TypingSession", typingSessionSchema);

export default TypingSession;
