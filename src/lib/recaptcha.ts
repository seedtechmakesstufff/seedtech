/**
 * recaptcha.ts
 * ────────────
 * Client-side helper to get a reCAPTCHA v3 token before form submission.
 *
 * Usage in a form submit handler:
 *   const token = await getRecaptchaToken("contact_form");
 *   // include token in the POST body as `_recaptcha`
 *
 * The server verifies the token in form-security.ts (layer 5).
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Returns a reCAPTCHA v3 token for the given action.
 * Returns empty string if the script hasn't loaded yet (form still submits, server skips check).
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return "";

  return new Promise((resolve) => {
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(""); // Don't block the form on grecaptcha errors
      }
    });
  });
}
