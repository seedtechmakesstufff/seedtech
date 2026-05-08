"use client";

import { useCallback, useState, type FormEvent } from "react";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button, FormInput, FormTextarea } from "@/components/kit";
import { FormGuard, useFormGuard } from "@/components/forms/FormGuard";
import { trackLead } from "@/lib/gtag";

function SalesRepApplicationFormInner() {
  const guard = useFormGuard();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resumeName, setResumeName] = useState("");

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = event.currentTarget;
    const payload = new FormData(form);

    let recaptchaToken = "";
    if (executeRecaptcha) {
      recaptchaToken = await executeRecaptcha("sales_rep_application_form");
    }

    payload.append("recaptchaToken", recaptchaToken);

    try {
      const response = await fetch("/api/sales-rep-application", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong.");
      }

      trackLead("contact", { service: "sales_rep_application" });
      setStatus("success");
      setResumeName("");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "Something went wrong.");
    }
  }, [executeRecaptcha]);

  if (status === "success") {
    return (
      <div className="rounded-[1.5rem] border border-seed-500/20 bg-seed-500/6 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-seed-500/12 text-seed-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-3xl text-dark-base">Application received</h3>
        <p className="mt-3 text-sm leading-relaxed text-dark-base/70">
          Your resume and application are in. SeedTech will review everything and reach out if there is a fit for the next step.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-seed-700 underline underline-offset-4 transition-colors hover:text-seed-600"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormGuard started={guard.started} />

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Full Name" name="fullName" placeholder="Jordan Smith" required theme="light" />
        <FormInput label="Email Address" name="email" type="email" placeholder="jordan@example.com" required theme="light" />
        <FormInput label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" required theme="light" />
        <FormInput label="Location" name="location" placeholder="North Jersey" required theme="light" />
        <FormInput label="Current Company" name="currentCompany" placeholder="Optional" theme="light" />
        <FormInput label="LinkedIn URL" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/yourname" theme="light" />
      </div>

      <FormTextarea
        label="Why are you a fit for this role?"
        name="message"
        placeholder="Optional: tell us about your outbound process, the accounts you have sold into, or anything else we should know."
        rows={4}
        theme="light"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-base/78">Resume</label>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dark-base/10 bg-light-base px-4 py-4 transition-colors hover:border-seed-500/40">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-seed-500/10 text-seed-600">
              {status === "submitting" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark-base">Upload PDF, DOC, or DOCX</p>
              <p className="mt-1 truncate text-sm text-dark-base/60">
                {resumeName || "Max 8 MB. Resume upload is required."}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl border border-dark-base/10 bg-white px-3 py-2 text-sm font-medium text-dark-base">
            <FileText className="h-4 w-4" />
            Choose file
          </span>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            required
            onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-dark-base/50">
          Takes about two minutes. Protected by reCAPTCHA. Resume uploads are stored securely for application review only.
        </p>
        <Button type="submit" variant="primary" size="md" icon="send" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Apply Now"}
        </Button>
      </div>
    </form>
  );
}

export function SalesRepApplicationForm() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}>
      <SalesRepApplicationFormInner />
    </GoogleReCaptchaProvider>
  );
}