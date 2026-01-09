import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Payment from "@/models/Payment";
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

    const { invoiceId } = await req.json();

    await connect();

    const payment = await Payment.findOne({ 
      invoiceId, 
      studentEmail: session.user.email 
    });

    if (!payment) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: payment.serviceName,
              description: `Invoice ID: ${payment.invoiceId}`,
            },
            unit_amount: Math.round(payment.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/student/payments?success=true&invoice=${invoiceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/student/payments?canceled=true`,
      metadata: {
        invoiceId: payment.invoiceId,
        studentEmail: session.user.email,
      },
    });

    return NextResponse.json({ url: sessionStripe.url });

  } catch (error) { 
    // ✅ ফিক্স ২: ': any' বাদ দেওয়া হয়েছে এবং টাইপ চেক করা হয়েছে
    console.error("Stripe Error:", error);
    
    // error কে Error টাইপে কাস্ট করে মেসেজ বের করা হচ্ছে
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}