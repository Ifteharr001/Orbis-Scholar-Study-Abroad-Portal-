import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Invoice from "@/models/Invoice"; 
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

    const invoice = await Invoice.findOne({ 
      _id: invoiceId, 
      studentEmail: session.user.email 
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "Paid") {
        return NextResponse.json({ error: "This invoice is already paid" }, { status: 400 });
    }

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: invoice.programName || invoice.type || "University Fee", 
              description: `Invoice ID: ${invoice.invoiceId}`,
            },
            unit_amount: Math.round(invoice.amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/student/finance?success=true&invoice=${invoiceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/student/finance?canceled=true`,
      
      metadata: {
        invoiceId: invoice._id.toString(), 
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