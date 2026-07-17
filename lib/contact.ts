export type ContactCategory =
  | "general"
  | "support"
  | "data_correction"
  | "partnership"
  | "advertising"
  | "bug_report"
  | "feature_request";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  category: ContactCategory;
  message: string;
  company: string;
  website: string;
  cardName: string;
  cardSet: string;
  cardNumber: string;
  evidenceUrl: string;
  accountEmail: string;
  affectedPage: string;
  budget: string;
  consent: boolean;
  companyWebsite: string;
};

const ALLOWED_CATEGORIES = new Set<ContactCategory>([
  "general",
  "support",
  "data_correction",
  "partnership",
  "advertising",
  "bug_report",
  "feature_request",
]);

const CATEGORY_LABELS: Record<ContactCategory, string> = {
  general: "General enquiry",
  support: "Account or platform support",
  data_correction: "Card data correction",
  partnership: "Partnership",
  advertising: "Advertising",
  bug_report: "Bug report",
  feature_request: "Feature request",
};

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value: unknown) {
  return cleanText(value, 160).toLowerCase();
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isOptionalUrlValid(value: string) {
  if (!value) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeContactPayload(input: unknown): ContactPayload {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const rawCategory = cleanText(source.category, 40);

  const category = ALLOWED_CATEGORIES.has(
    rawCategory as ContactCategory
  )
    ? (rawCategory as ContactCategory)
    : "general";

  return {
    name: cleanText(source.name, 100),
    email: cleanEmail(source.email),
    subject: cleanText(source.subject, 160),
    category,
    message: cleanText(source.message, 5000),
    company: cleanText(source.company, 160),
    website: cleanText(source.website, 500),
    cardName: cleanText(source.cardName, 140),
    cardSet: cleanText(source.cardSet, 140),
    cardNumber: cleanText(source.cardNumber, 60),
    evidenceUrl: cleanText(source.evidenceUrl, 500),
    accountEmail: cleanEmail(source.accountEmail),
    affectedPage: cleanText(source.affectedPage, 500),
    budget: cleanText(source.budget, 100),
    consent: source.consent === true,
    companyWebsite: cleanText(source.companyWebsite, 300),
  };
}

export function validateContactPayload(payload: ContactPayload): {
  valid: boolean;
  message: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  if (payload.name.length < 2) {
    fieldErrors.name = "Enter your full name.";
  }

  if (!isValidEmail(payload.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (payload.subject.length < 3) {
    fieldErrors.subject = "Enter a clear subject.";
  }

  if (payload.message.length < 20) {
    fieldErrors.message =
      "Please provide at least 20 characters so we can understand your enquiry.";
  }

  if (!payload.consent) {
    fieldErrors.consent =
      "You must agree before sending the message.";
  }

  if (
    payload.category === "data_correction" &&
    !payload.cardName
  ) {
    fieldErrors.cardName = "Enter the card name.";
  }

  if (
    payload.category === "data_correction" &&
    !payload.cardSet
  ) {
    fieldErrors.cardSet = "Enter the card set.";
  }

  if (
    (payload.category === "partnership" ||
      payload.category === "advertising") &&
    !payload.company
  ) {
    fieldErrors.company =
      "Enter your company or organisation.";
  }

  if (!isOptionalUrlValid(payload.website)) {
    fieldErrors.website =
      "Enter a complete URL beginning with http:// or https://.";
  }

  if (!isOptionalUrlValid(payload.evidenceUrl)) {
    fieldErrors.evidenceUrl =
      "Enter a complete URL beginning with http:// or https://.";
  }

  if (
    payload.accountEmail &&
    !isValidEmail(payload.accountEmail)
  ) {
    fieldErrors.accountEmail =
      "Enter a valid account email address.";
  }

  const valid = Object.keys(fieldErrors).length === 0;

  return {
    valid,
    fieldErrors,
    message: valid
      ? ""
      : Object.values(fieldErrors)[0] ||
        "Please review the form and try again.",
  };
}

export function formatContactCategory(
  category: ContactCategory
) {
  return CATEGORY_LABELS[category] || CATEGORY_LABELS.general;
}

export function createContactReference() {
  const date = new Date();
  const datePart = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");

  const randomPart = crypto.randomUUID()
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase();

  return `CMC-${datePart}-${randomPart}`;
}

function renderDetailRow(label: string, value: string) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:12px 0;color:#64748b;font-size:13px;font-weight:700;width:170px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 0;color:#0f172a;font-size:14px;font-weight:700;vertical-align:top;word-break:break-word;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

export function buildContactAdminHtml(
  payload: ContactPayload,
  referenceId: string
) {
  const category = formatContactCategory(payload.category);
  const submittedAt = new Date().toISOString();

  const details = [
    renderDetailRow("Reference", referenceId),
    renderDetailRow("Category", category),
    renderDetailRow("Name", payload.name),
    renderDetailRow("Email", payload.email),
    renderDetailRow("Subject", payload.subject),
    renderDetailRow("Company", payload.company),
    renderDetailRow("Website", payload.website),
    renderDetailRow("Card name", payload.cardName),
    renderDetailRow("Card set", payload.cardSet),
    renderDetailRow("Card number", payload.cardNumber),
    renderDetailRow("Evidence URL", payload.evidenceUrl),
    renderDetailRow("Account email", payload.accountEmail),
    renderDetailRow("Affected page", payload.affectedPage),
    renderDetailRow("Budget", payload.budget),
    renderDetailRow("Submitted", submittedAt),
  ].join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
        <div style="padding:32px 16px;">
          <div style="max-width:720px;margin:0 auto;overflow:hidden;border:1px solid #e2e8f0;border-radius:20px;background:#ffffff;">
            <div style="padding:28px 32px;background:#020617;">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#00ba88;">
                CardMarketCap
              </div>
              <h1 style="margin:10px 0 0;color:#ffffff;font-size:26px;line-height:1.2;">
                New contact submission
              </h1>
            </div>

            <div style="padding:28px 32px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${details}
              </table>

              <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e2e8f0;">
                <div style="margin-bottom:10px;color:#64748b;font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">
                  Message
                </div>
                <div style="white-space:pre-wrap;color:#0f172a;font-size:15px;line-height:1.75;">
                  ${escapeHtml(payload.message)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function buildContactAutoReplyHtml(
  payload: ContactPayload,
  referenceId: string
) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
        <div style="padding:32px 16px;">
          <div style="max-width:640px;margin:0 auto;overflow:hidden;border:1px solid #e2e8f0;border-radius:20px;background:#ffffff;">
            <div style="padding:28px 32px;background:#020617;">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#00ba88;">
                CardMarketCap
              </div>
              <h1 style="margin:10px 0 0;color:#ffffff;font-size:25px;line-height:1.2;">
                We received your message
              </h1>
            </div>

            <div style="padding:30px 32px;color:#334155;font-size:15px;line-height:1.75;">
              <p style="margin:0 0 18px;">
                Hi ${escapeHtml(payload.name)},
              </p>

              <p style="margin:0 0 18px;">
                Thanks for contacting CardMarketCap. Your enquiry has been received and routed to the appropriate team.
              </p>

              <div style="margin:22px 0;padding:18px;border-radius:14px;background:#f1f5f9;">
                <div style="color:#64748b;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">
                  Reference
                </div>
                <div style="margin-top:5px;color:#0f172a;font-size:16px;font-weight:800;">
                  ${escapeHtml(referenceId)}
                </div>
              </div>

              <p style="margin:0 0 18px;">
                We normally respond within one business day. Please keep the reference above if you need to follow up.
              </p>

              <p style="margin:0;">
                Regards,<br />
                <strong style="color:#0f172a;">CardMarketCap</strong>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
