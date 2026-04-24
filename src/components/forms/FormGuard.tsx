/**
 * FormGuard — invisible anti-bot fields for all public forms.
 *
 * Renders:
 *  1. A hidden honeypot <input> that bots auto-fill (humans never see it)
 *  2. A hidden timestamp <input> tracking when the form first rendered
 *
 * reCAPTCHA v3 tokens are fetched per-form via useGoogleReCaptcha() and
 * passed as a top-level `recaptchaToken` field, not through FormGuard.
 *
 * Usage:
 *   import { FormGuard, useFormGuard } from "@/components/forms/FormGuard";
 *
 *   const guard = useFormGuard();
 *
 *   // In JSX:
 *   <form>
 *     <FormGuard started={guard.started} />
 *     ...
 *   </form>
 *
 *   // In submit handler — spread into the body:
 *   body: JSON.stringify({ ...formData, ...guard.fields() })
 */

"use client";

import { useRef } from "react";

/** Returns the guard timestamp and a fields() helper. */
export function useFormGuard() {
  const started = useRef(Date.now());

  return {
    started: started.current,
    /** Security fields to merge into the fetch body */
    fields: () => ({
      _started: started.current,
      website_url: "", // honeypot — must be empty
    }),
  };
}

/** Hidden fields rendered inside a <form> element. */
export function FormGuard({ started }: { started: number }) {
  return (
    <>
      {/* Honeypot — invisible to humans, auto-filled by bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
        <label htmlFor="website_url">Website URL</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {/* Timing — records when the form rendered */}
      <input type="hidden" name="_started" value={started} />
    </>
  );
}

/** Hidden fields rendered inside a <form> element. */
export function FormGuard({ started }: { started: number }) {
  return (
    <>
      {/* Honeypot — invisible to humans, auto-filled by bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
        <label htmlFor="website_url">Website URL</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {/* Timing — records when the form rendered */}
      <input type="hidden" name="_started" value={started} />
    </>
  );
}
