import { NextRequest, NextResponse } from "next/server";

import {
  buildContactAdminHtml,
  buildContactAutoReplyHtml,
  createContactReference,
  formatContactCategory,
  sanitizeContactPayload,
  validateContactPayload,
} from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function checkRateLimit(identifier: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now >= existing.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  rateLimitStore.set(identifier, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  replyTo,
}: {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName =
    process.env.BREVO_SENDER_NAME || "CardMarketCap";

  if (!apiKey || !senderEmail) {
    throw new Error(
      "Brevo is not configured. Add BREVO_API_KEY and BREVO_SENDER_EMAIL."
    );
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to,
      subject,
      htmlContent,
      replyTo,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Brevo email error:", response.status, errorBody);

    throw new Error("Brevo could not send the email.");
  }
}

async function upsertBrevoContact({
  email,
  name,
  category,
}: {
  email: string;
  name: string;
  category: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return;
  }

  const listId = Number(process.env.BREVO_CONTACT_LIST_ID || "");

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: name,
        CONTACT_CATEGORY: category,
      },
      updateEnabled: true,
      ...(Number.isFinite(listId) && listId > 0
        ? { listIds: [listId] }
        : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();

    /*
     * Contact creation should not prevent the actual enquiry email from
     * being delivered. Log it and continue.
     */
    console.error(
      "Brevo contact upsert warning:",
      response.status,
      errorBody
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request format.",
        },
        { status: 415 }
      );
    }

    const ipAddress = getClientIp(request);
    const rateLimit = checkRateLimit(ipAddress);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many messages were submitted. Please wait before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const rawPayload = await request.json();
    const payload = sanitizeContactPayload(rawPayload);

    /*
     * Honeypot: silently accept likely bot submissions without sending.
     */
    if (payload.companyWebsite) {
      return NextResponse.json({
        success: true,
        message: "Thanks. Your message has been received.",
      });
    }

    const validation = validateContactPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
          fieldErrors: validation.fieldErrors,
        },
        { status: 400 }
      );
    }

    const receiverEmail =
      process.env.BREVO_RECEIVER_EMAIL ||
      "hello@cardmarketcap.com";

    const referenceId = createContactReference();
    const categoryLabel = formatContactCategory(payload.category);

    await sendBrevoEmail({
      to: [
        {
          email: receiverEmail,
          name: "CardMarketCap",
        },
      ],
      subject: `[${referenceId}] ${categoryLabel}: ${payload.subject}`,
      htmlContent: buildContactAdminHtml(payload, referenceId),
      replyTo: {
        email: payload.email,
        name: payload.name,
      },
    });

    await upsertBrevoContact({
      email: payload.email,
      name: payload.name,
      category: categoryLabel,
    });

    if (process.env.BREVO_SEND_AUTOREPLY !== "false") {
      try {
        await sendBrevoEmail({
          to: [
            {
              email: payload.email,
              name: payload.name,
            },
          ],
          subject: `We received your CardMarketCap enquiry — ${referenceId}`,
          htmlContent: buildContactAutoReplyHtml(
            payload,
            referenceId
          ),
        });
      } catch (error) {
        /*
         * The user message has already reached CardMarketCap. A failed
         * acknowledgement should not convert the whole request to an error.
         */
        console.error("Brevo auto-reply warning:", error);
      }
    }

    return NextResponse.json({
      success: true,
      referenceId,
      message:
        "Thanks for contacting CardMarketCap. We have received your message and will respond as soon as possible.",
    });
  } catch (error) {
    console.error("Contact route error:", error);

    const isConfigurationError =
      error instanceof Error &&
      error.message.includes("Brevo is not configured");

    return NextResponse.json(
      {
        success: false,
        message: isConfigurationError
          ? "The contact service is being configured. Please email hello@cardmarketcap.com for now."
          : "Your message could not be sent right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
