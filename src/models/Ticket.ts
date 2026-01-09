import mongoose, { Schema, model, models } from "mongoose";

const TicketSchema = new Schema(
  {
    studentEmail: { type: String, required: true },
    subject: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["General Issue", "Technical Problem", "Counselor Request", "Payment Issue"], 
      default: "General Issue" 
    },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Open", "In Progress", "Closed"], 
      default: "Open" 
    },
    reply: { type: String }, // অ্যাডমিনের রিপ্লাই
  },
  { timestamps: true }
);

const Ticket = models.Ticket || model("Ticket", TicketSchema);

export default Ticket;