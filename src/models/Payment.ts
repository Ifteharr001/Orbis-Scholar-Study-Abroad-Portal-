
import mongoose, { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    studentEmail: { type: String, required: true },
    invoiceId: { type: String, required: true, unique: true }, // যেমন: INV-1001
    serviceName: { type: String, required: true }, // যেমন: University Application Fee
    amount: { type: Number, required: true }, // যেমন: 150
    currency: { type: String, default: "USD" },
    status: { 
      type: String, 
      enum: ["Paid", "Pending", "Failed"], 
      default: "Pending" 
    },
    paymentMethod: { type: String, default: "Stripe" },
    transactionId: { type: String }, // Stripe থেকে পাওয়া ট্রানজেকশন আইডি
    paidAt: { type: Date }, // কবে পেমেন্ট কমপ্লিট হলো
  },
  { timestamps: true } // এটি অটোমেটিক createdAt এবং updatedAt ফিল্ড তৈরি করবে
);

const Payment = models.Payment || model("Payment", PaymentSchema);

export default Payment;