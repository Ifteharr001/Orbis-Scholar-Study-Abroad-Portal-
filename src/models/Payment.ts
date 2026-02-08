import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  transactionId: string; 
  invoiceId?: string;    
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: string;
  method: "Credit Card" | "Bank Transfer" | "PayPal" | "Cash";
  status: "Completed" | "Refunded" | "Failed";
  date: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true },
    invoiceId: { type: String }, 
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    method: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Completed", "Refunded", "Failed"], 
      default: "Completed" 
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;