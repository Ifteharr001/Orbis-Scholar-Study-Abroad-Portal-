import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITicket extends Document {
  userId?: mongoose.Types.ObjectId; 
  userEmail: string;
  userName?: string;
  role: "student" | "counselor"; 
  subject: string;
  type: string;
  message: string;
  status: "Open" | "In Progress" | "Closed";
  reply?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    
    userEmail: { type: String, required: true },
    userName: { type: String },
    
    role: { 
      type: String, 
      enum: ["student", "counselor"], 
      default: "student",
      required: true
    },

    subject: { type: String, required: true },
    type: { type: String, default: "General Issue" },
    message: { type: String, required: true },
    
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Closed"], 
      default: "Open" 
    },
    
    reply: { type: String }, 
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;