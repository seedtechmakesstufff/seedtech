"use client";

import { useState, type FormEvent } from "react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FormInput, FormTextarea, FormSelect, Button, LiquidGlassCard } from "@/components/kit";
import { CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    service: "it",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setForm({ fullName: "", email: "", company: "", service: "it", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="pt-20">
        <Section>
          <div className="mx-auto max-w-lg text-center space-y-6 py-20">
            <div className="mx-auto w-16 h-16 rounded-full bg-seed-600/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-seed-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Message Sent!</h2>
            <p className="text-white/60">
              Thanks for reaching out. We&apos;ll get back to you within one business day.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-seed-400 hover:text-seed-300 text-sm underline underline-offset-4"
            >
              Send another message
            </button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Contact"
          title="Let's"
          titleHighlight="Talk"
          description="Tell us about your project or IT challenge, and we'll get back to you within one business day."
        />

        <LiquidGlassCard className="mx-auto max-w-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              placeholder="john@example.com"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Company"
              name="company"
              placeholder="Acme Inc."
              value={form.company}
              onChange={handleChange}
            />
            <FormSelect
              label="Service Interested In"
              name="service"
              value={form.service}
              onChange={handleChange}
              options={[
                { label: "Managed IT Support", value: "it" },
                { label: "Web Development", value: "web" },
                { label: "SEO", value: "seo" },
                { label: "Managed IT + Web Development", value: "it-web" },
                { label: "All the above", value: "all" },
              ]}
            />
          </div>
          <FormTextarea
            label="Tell Us About Your Project"
            name="message"
            placeholder="What challenges are you facing?"
            rows={6}
            value={form.message}
            onChange={handleChange}
            required
          />

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}

          <div className="text-center pt-2">
            <Button
              variant="primary"
              size="lg"
              icon="send"
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send Message"}
            </Button>
          </div>
          </form>
        </LiquidGlassCard>
      </Section>
    </div>
  );
}
