import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validations/newsletter";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error("Resend client not configured");
  }
  return resend;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = newsletterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resendClient = getResendClient();

    // Send welcome email to subscriber
    await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Welcome to FlatWP - You're on the list! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6600;">Welcome to FlatWP!</h1>
          <p>Thanks for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul>
            <li>Product launches and updates</li>
            <li>New features and improvements</li>
            <li>Exclusive early access opportunities</li>
            <li>Tips and best practices for headless WordPress</li>
          </ul>
          <p>We're working hard to make FlatWP the best headless WordPress starter for Next.js.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you didn't subscribe to this newsletter, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    // Send notification to admin (optional)
    if (process.env.RESEND_AUDIENCE_EMAIL) {
      await resendClient.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.RESEND_AUDIENCE_EMAIL,
        subject: "New FlatWP Newsletter Subscription",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>New subscriber!</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Handle specific Resend errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
