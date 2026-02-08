import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoice extends Document {
  invoiceId: string;
  studentName: string;
  studentEmail: string;
  applicationId?: string; 
  programName?: string;
  amount: number;
  currency: string;
  type: "Application Fee" | "Tuition Fee" | "Security Deposit";
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  paymentMethod?: string;
  createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    applicationId: { type: String },
    programName: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    type: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Paid", "Pending", "Failed", "Refunded"], 
      default: "Pending" 
    },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;