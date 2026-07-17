"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import CustomDropdown from "@/components/CustomDropdown";
import { cn } from "@/lib/utils";

type ContactCategory =
  | "general"
  | "support"
  | "data_correction"
  | "partnership"
  | "advertising"
  | "bug_report"
  | "feature_request";

type FormState = {
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

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  category: "general",
  message: "",
  company: "",
  website: "",
  cardName: "",
  cardSet: "",
  cardNumber: "",
  evidenceUrl: "",
  accountEmail: "",
  affectedPage: "",
  budget: "",
  consent: false,
  companyWebsite: "",
};

const CATEGORY_OPTIONS: Array<{
  value: ContactCategory;
  label: string;
}> = [
  { value: "general", label: "General enquiry" },
  { value: "support", label: "Account or platform support" },
  { value: "data_correction", label: "Card data correction" },
  { value: "partnership", label: "Partnership" },
  { value: "advertising", label: "Advertising" },
  { value: "bug_report", label: "Bug report" },
  { value: "feature_request", label: "Feature request" },
];

const CATEGORY_LABELS = CATEGORY_OPTIONS.map(
  (option) => option.label
);

const getCategoryLabel = (
  category: ContactCategory
) =>
  CATEGORY_OPTIONS.find(
    (option) => option.value === category
  )?.label || "General enquiry";

const getCategoryValue = (
  label: string
): ContactCategory =>
  CATEGORY_OPTIONS.find(
    (option) => option.label === label
  )?.value || "general";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#00BA88] focus:ring-4 focus:ring-[#00BA88]/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white";

const labelClassName =
  "mb-2 block text-[11px] pl-2 md:pl-0 font-black uppercase tracking-[0.13em] text-slate-600 dark:text-slate-300";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const isBusinessCategory =
    form.category === "partnership" ||
    form.category === "advertising";

  const isSupportCategory =
    form.category === "support" ||
    form.category === "bug_report";

  const isCorrectionCategory =
    form.category === "data_correction";

  const messageHint = useMemo(() => {
    switch (form.category) {
      case "data_correction":
        return "Explain what is incorrect and what the correct information should be.";
      case "support":
        return "Describe the issue, what you expected and what happened instead.";
      case "bug_report":
        return "Include steps to reproduce the problem, device and browser where possible.";
      case "partnership":
      case "advertising":
        return "Tell us about your organisation, goals and the opportunity.";
      case "feature_request":
        return "Describe the feature, the problem it solves and who would benefit.";
      default:
        return "Give us enough context to understand and route your enquiry.";
    }
  }, [form.category]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setFeedback("");
    setReferenceId("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Your message could not be sent. Please review the form and try again."
        );
      }

      setStatus("success");
      setFeedback(
        data.message ||
          "Thanks for contacting CardMarketCap. We have received your message."
      );
      setReferenceId(data.referenceId || "");
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-[2rem]">
      <div className="border-b border-slate-200 px-5 py-6 dark:border-slate-800 sm:px-7 md:px-9 md:py-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
          Send a message
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
          How can we help?
        </h2>

        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Fields marked with an asterisk are required. Please do not include
          passwords, payment details or other sensitive information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 p-5 sm:p-7 md:p-9"
      >
        <div
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="companyWebsite">Company website</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.companyWebsite}
            onChange={(event) =>
              updateField("companyWebsite", event.target.value)
            }
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="name">
              Full name *
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              className={inputClassName}
              placeholder="Your full name"
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
            />
          </div>

          <div>
            <label className={labelClassName} htmlFor="email">
              Email address *
            </label>
            <input
              id="email"
              type="email"
              required
              maxLength={160}
              autoComplete="email"
              className={inputClassName}
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClassName}>
              Enquiry type *
            </label>

            <CustomDropdown
              value={getCategoryLabel(form.category)}
              options={CATEGORY_LABELS}
              onChange={(label) =>
                updateField(
                  "category",
                  getCategoryValue(label)
                )
              }
              className={cn(
                "md:w-full",
                "[&>button]:h-auto",
                "[&>button]:min-h-[50px]",
                "[&>button]:rounded-xl",
                "[&>button]:border-slate-200",
                "[&>button]:bg-white",
                "[&>button]:px-4",
                "[&>button]:py-3",
                "[&>button]:shadow-none",
                "[&>button]:dark:border-slate-800",
                "[&>button]:dark:bg-slate-950",
                "[&>button>div>span:last-child]:mt-0",
                "[&>button>div>span:last-child]:text-sm",
                "[&>button>div>span:last-child]:font-medium",
                "[&>button>div>span:last-child]:normal-case",
                "[&>button>div>span:last-child]:tracking-normal",
                "[&>button>div>span:last-child]:text-slate-950",
                "[&>button>div>span:last-child]:dark:text-white"
              )}
            />
          </div>

          <div>
            <label className={labelClassName} htmlFor="subject">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              required
              maxLength={160}
              className={inputClassName}
              placeholder="A brief summary"
              value={form.subject}
              onChange={(event) =>
                updateField("subject", event.target.value)
              }
            />
          </div>
        </div>

        {isCorrectionCategory && (
          <div className="grid gap-5 rounded-2xl border border-[#00BA88]/20 bg-[#00BA88]/[0.035] p-5 md:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="cardName">
                Card name *
              </label>
              <input
                id="cardName"
                type="text"
                required
                maxLength={140}
                className={inputClassName}
                placeholder="e.g. Charizard ex"
                value={form.cardName}
                onChange={(event) =>
                  updateField("cardName", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="cardSet">
                Set *
              </label>
              <input
                id="cardSet"
                type="text"
                required
                maxLength={140}
                className={inputClassName}
                placeholder="e.g. 151"
                value={form.cardSet}
                onChange={(event) =>
                  updateField("cardSet", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="cardNumber">
                Card number
              </label>
              <input
                id="cardNumber"
                type="text"
                maxLength={60}
                className={inputClassName}
                placeholder="e.g. 199/165"
                value={form.cardNumber}
                onChange={(event) =>
                  updateField("cardNumber", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="evidenceUrl">
                Card or evidence URL
              </label>
              <input
                id="evidenceUrl"
                type="url"
                maxLength={500}
                className={inputClassName}
                placeholder="https://"
                value={form.evidenceUrl}
                onChange={(event) =>
                  updateField("evidenceUrl", event.target.value)
                }
              />
            </div>
          </div>
        )}

        {isSupportCategory && (
          <div className="grid gap-5 rounded-2xl border border-[#00BA88]/20 bg-[#00BA88]/[0.035] p-5 md:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="accountEmail">
                Account email
              </label>
              <input
                id="accountEmail"
                type="email"
                maxLength={160}
                className={inputClassName}
                placeholder="Account email, if different"
                value={form.accountEmail}
                onChange={(event) =>
                  updateField("accountEmail", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="affectedPage">
                Affected page or URL
              </label>
              <input
                id="affectedPage"
                type="text"
                maxLength={500}
                className={inputClassName}
                placeholder="/card/... or full URL"
                value={form.affectedPage}
                onChange={(event) =>
                  updateField("affectedPage", event.target.value)
                }
              />
            </div>
          </div>
        )}

        {isBusinessCategory && (
          <div className="grid gap-5 rounded-2xl border border-[#00BA88]/20 bg-[#00BA88]/[0.035] p-5 md:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="company">
                Organisation *
              </label>
              <input
                id="company"
                type="text"
                required
                maxLength={160}
                className={inputClassName}
                placeholder="Company or organisation"
                value={form.company}
                onChange={(event) =>
                  updateField("company", event.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="website">
                Website
              </label>
              <input
                id="website"
                type="url"
                maxLength={500}
                className={inputClassName}
                placeholder="https://"
                value={form.website}
                onChange={(event) =>
                  updateField("website", event.target.value)
                }
              />
            </div>

            {form.category === "advertising" && (
              <div className="md:col-span-2">
                <label className={labelClassName} htmlFor="budget">
                  Estimated budget
                </label>
                <input
                  id="budget"
                  type="text"
                  maxLength={100}
                  className={inputClassName}
                  placeholder="Optional budget or campaign range"
                  value={form.budget}
                  onChange={(event) =>
                    updateField("budget", event.target.value)
                  }
                />
              </div>
            )}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <label className="block text-[11px] font-black uppercase tracking-[0.13em] text-slate-600 dark:text-slate-300" htmlFor="message">
              Message *
            </label>

            <span className="text-[10px] font-bold text-slate-400">
              {form.message.length}/5000
            </span>
          </div>

          <textarea
            id="message"
            required
            minLength={20}
            maxLength={5000}
            rows={8}
            className={`${inputClassName} resize-y leading-7`}
            placeholder={messageHint}
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
          />

          <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
            {messageHint}
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(event) =>
              updateField("consent", event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#00BA88] focus:ring-[#00BA88]"
          />

          <span className="text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
            I agree that CardMarketCap may use the information provided to
            respond to this enquiry. *
          </span>
        </label>

        {status === "success" && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-black">{feedback}</p>
              {referenceId && (
                <p className="mt-1 text-xs font-bold">
                  Reference: {referenceId}
                </p>
              )}
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{feedback}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00BA88] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#00BA88]/20 transition-all hover:bg-[#00a377] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto sm:min-w-[210px] cursor-pointer"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending message
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
