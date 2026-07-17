"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  cardName: string;
  cardSet: string;
  cardNumber: string;
  evidenceUrl: string;
  affectedPage: string;
  consent: boolean;
  companyWebsite: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  cardName: "",
  cardSet: "",
  cardNumber: "",
  evidenceUrl: "",
  affectedPage: "",
  consent: false,
  companyWebsite: "",
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#00BA88] focus:ring-4 focus:ring-[#00BA88]/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white";

const labelClassName =
  "mb-2 pl-2 md:pl-0 block text-[11px] font-black uppercase tracking-[0.13em] text-slate-600 dark:text-slate-300";

export default function DataCorrectionForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [referenceId, setReferenceId] = useState("");

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
        body: JSON.stringify({
          ...form,
          category: "data_correction",
          company: "",
          website: "",
          accountEmail: "",
          budget: "",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Your correction could not be submitted. Please review the form and try again."
        );
      }

      setStatus("success");
      setFeedback(
        data.message ||
          "Thanks. Your data correction has been submitted for review."
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
          Correction details
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-3xl">
          Report a data issue.
        </h2>

        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Fields marked with an asterisk are required. Please provide reliable
          evidence where possible.
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
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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
            <label className={labelClassName} htmlFor="subject">
              Issue summary *
            </label>

            <input
              id="subject"
              type="text"
              required
              maxLength={160}
              className={inputClassName}
              placeholder="e.g. Incorrect rarity shown"
              value={form.subject}
              onChange={(event) =>
                updateField("subject", event.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className={labelClassName} htmlFor="affectedPage">
            Affected CardMarketCap page *
          </label>

          <input
            id="affectedPage"
            type="text"
            required
            maxLength={500}
            className={inputClassName}
            placeholder="/card/... or full CardMarketCap URL"
            value={form.affectedPage}
            onChange={(event) =>
              updateField("affectedPage", event.target.value)
            }
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="evidenceUrl">
            Evidence or source URL
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

          <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
            Link to an official checklist, grading record, marketplace evidence
            or another reliable source.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <label
              className="block text-[11px] font-black uppercase tracking-[0.13em] text-slate-600 dark:text-slate-300"
              htmlFor="message"
            >
              Correction details *
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
            rows={9}
            className={`${inputClassName} resize-y leading-7`}
            placeholder="Explain what currently appears, what the correct information should be and why."
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
          />
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
            I confirm that this report is submitted in good faith and that
            CardMarketCap may use the information provided to investigate the
            issue. *
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00BA88] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[#00BA88]/20 transition-all hover:bg-[#00a377] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto sm:min-w-[220px]"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting report
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit correction
            </>
          )}
        </button>
      </form>
    </div>
  );
}
