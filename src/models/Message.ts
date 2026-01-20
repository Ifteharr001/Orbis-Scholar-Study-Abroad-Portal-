import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    
    senderRole: { type: String, enum: ["student", "counselor", "admin"], default: "student" } 
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);
export default Message;