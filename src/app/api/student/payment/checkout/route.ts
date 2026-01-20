import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Invoice from "@/models/Invoice"; // 🔥 পরিবর্তন ১: Payment এর বদলে Invoice
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2025-01-27.acacia" as any,
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ফ্রন্টএন্ড থেকে আমরা ইনভয়েসের _id বা invoiceId পাচ্ছি
    const { invoiceId } = await req.json();

    await connect();

    // 🔥 পরিবর্তন ২: আমরা Invoice খুঁজছি যেটা পেমেন্ট করতে হবে
    // আমরা চেক করছি যে ইনভয়েসটি এই স্টুডেন্টের কিনা
    const invoice = await Invoice.findOne({ 
      _id: invoiceId, 
      studentEmail: session.user.email 
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 🔥 পরিবর্তন ৩: চেক করা হচ্ছে ইনভয়েসটি আগে থেকেই পেমেন্ট করা কিনা
    if (invoice.status === "Paid") {
        return NextResponse.json({ error: "This invoice is already paid" }, { status: 400 });
    }

    // স্ট্রাইপ সেশন তৈরি
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // বা আপনার ইনভয়েসের invoice.currency
            product_data: {
              name: invoice.programName || invoice.type || "University Fee", // নাম ঠিক করা হলো
              description: `Invoice ID: ${invoice.invoiceId}`,
            },
            unit_amount: Math.round(invoice.amount * 100), // ডলার থেকে সেন্ট-এ কনভার্ট
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // পেমেন্ট শেষে কোথায় রিডাইরেক্ট হবে
      success_url: `${process.env.NEXT_PUBLIC_URL}/student/finance?success=true&invoice=${invoiceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/student/finance?canceled=true`,
      
      // 🔥 পরিবর্তন ৪: মেটাডাটা (এটা খুবই জরুরি Webhook এর জন্য)
      // পেমেন্ট সফল হলে স্ট্রাইপ এই মেটাডাটা ব্যাকএন্ডে পাঠাবে, তখন আমরা ডাটাবেস আপডেট করব
      metadata: {
        invoiceId: invoice._id.toString(), // মঙ্গোডিবি আইডি
        studentEmail: session.user.email,
        amount: invoice.amount.toString()
      },
    });

    return NextResponse.json({ url: sessionStripe.url });

  } catch (error) { 
    console.error("Stripe Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}