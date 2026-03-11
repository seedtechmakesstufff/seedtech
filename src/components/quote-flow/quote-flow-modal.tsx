"use client";

/**
 * QuoteFlowModal — a full-page modal that routes users through
 * either the IT Support or Web Development quote path.
 *
 * Flow:
 *   1) Select Service (IT Support | Web Development)
 *   2a) IT Support → reuses QuotePriceCalculator (4-step wizard)
 *   2b) Web Development → select tier → contact form
 *   3) Shared Thank You page
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Monitor,
  Globe,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteFlow } from "./quote-flow-provider";
import { QuotePriceCalculator } from "@/components/quote-generator/quote-price-calculator";
import type { ServicePath, WebDevTier, QuoteFlowStep } from "./types";

// ─── Web Dev tier data (reused from pricing page) ──────────────────────────
const webDevTiers: WebDevTier[] = [
  {
    name: "Starter Website",
    starting: "$2,500",
    description:
      "Perfect for small businesses that need a clean, professional online presence.",
    includes: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Fast, modern website build",
      "Basic SEO setup",
      "Contact form",
      "Launch and deployment",
    ],
    bestFor: ["Local businesses", "Startups", "Service providers"],
  },
  {
    name: "Growth Website",
    starting: "$7,800",
    description:
      "For businesses that need a more robust website with custom layouts and deeper content.",
    highlighted: true,
    includes: [
      "8–15 pages",
      "Custom design and layout",
      "Advanced UI components",
      "SEO-friendly structure",
      "Content strategy support",
      "Scalable architecture",
    ],
    bestFor: [
      "Growing businesses",
      "Professional services",
      "Organizations with multiple offerings",
    ],
  },
  {
    name: "Ecommerce Website",
    starting: "$15,000",
    description:
      "Full-featured ecommerce platforms designed to convert visitors into customers.",
    includes: [
      "Custom storefront design",
      "Product catalog setup",
      "Secure checkout integration",
      "Payment gateway configuration",
      "Inventory management",
      "Scalable ecommerce architecture",
    ],
    bestFor: ["Product brands", "Retail businesses", "Subscription products"],
  },
  {
    name: "Custom Web Application",
    starting: "$10,000+",
    description:
      "Custom platforms, portals, or specialized functionality for your business.",
    includes: [
      "Dashboards & internal tools",
      "Booking systems",
      "Membership platforms",
      "Custom SaaS products",
      "API integrations",
    ],
    bestFor: ["Tech-forward businesses", "SaaS founders", "Enterprise teams"],
  },
];

// ─── Animation variants ─────────────────────────────────────────────────────
const stepVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24, position: "absolute" as const, width: "100%" },
};

// ─── Inline form input (matches design system) ─────────────────────────────
function FlowInput({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white/70"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none",
          "bg-dark-overlay border border-white/[0.06] text-white placeholder:text-white/30",
          "focus:border-seed-600/50 focus:shadow-glowSeed",
          className
        )}
        {...props}
      />
    </div>
  );
}

function FlowTextarea({
  id,
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white/70"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none",
          "bg-dark-overlay border border-white/[0.06] text-white placeholder:text-white/30",
          "focus:border-seed-600/50 focus:shadow-glowSeed",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export function QuoteFlowModal() {
  const { isOpen, preselectedService, closeQuoteFlow } = useQuoteFlow();

  const [step, setStep] = useState<QuoteFlowStep>("select-service");
  const [servicePath, setServicePath] = useState<ServicePath | null>(null);

  // IT Support wizard state
  const [itStep, setItStep] = useState(0);

  // Web Dev state
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [webForm, setWebForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    currentSiteUrl: "",
    notes: "",
  });

  // ── Handle preselected service ──
  useEffect(() => {
    if (isOpen && preselectedService) {
      setServicePath(preselectedService);
      if (preselectedService === "it-support") {
        setStep("it-wizard");
        setItStep(0);
      } else {
        setStep("web-select-tier");
      }
    }
  }, [isOpen, preselectedService]);

  // ── Reset on close ──
  const handleClose = useCallback(() => {
    closeQuoteFlow();
    // Delay reset so exit animation plays
    setTimeout(() => {
      setStep("select-service");
      setServicePath(null);
      setItStep(0);
      setSelectedTier(null);
      setWebForm({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        currentSiteUrl: "",
        notes: "",
      });
    }, 300);
  }, [closeQuoteFlow]);

  // ── Service selection ──
  const handleServiceSelect = (service: ServicePath) => {
    setServicePath(service);
    if (service === "it-support") {
      setStep("it-wizard");
      setItStep(0);
    } else {
      setStep("web-select-tier");
    }
  };

  // ── Web Dev tier selection ──
  const handleTierSelect = (tierName: string) => {
    setSelectedTier(tierName);
    setStep("web-contact");
  };

  // ── Web Dev form submit ──
  const handleWebSubmit = () => {
    // In production this would POST to an API
    setStep("thank-you");
  };

  // ── IT Support submit handler ──
  const handleItSubmit = () => {
    setStep("thank-you");
  };

  const isWebFormValid =
    webForm.fullName && webForm.email && webForm.phone && webForm.businessName;

  // ── Progress helpers ──
  const getProgressInfo = (): { label: string; percent: number } => {
    switch (step) {
      case "select-service":
        return { label: "Choose a Service", percent: 0 };
      case "it-wizard": {
        const labels = ["Choose Plan", "Add-Ons", "Your Details", "Review"];
        return {
          label: labels[itStep] ?? "IT Support",
          percent: ((itStep + 1) / 5) * 100,
        };
      }
      case "web-select-tier":
        return { label: "Select a Package", percent: 33 };
      case "web-contact":
        return { label: "Your Details", percent: 66 };
      case "thank-you":
        return { label: "Complete", percent: 100 };
      default:
        return { label: "", percent: 0 };
    }
  };

  const progress = getProgressInfo();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quote-flow-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-dark-base/95 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative z-10 flex flex-col w-full h-full overflow-y-auto">
            {/* Top bar */}
            <div className="sticky top-0 z-20 bg-dark-base/80 backdrop-blur-xl border-b border-white/[0.04]">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Back / Title */}
                <div className="flex items-center gap-4">
                  {step !== "select-service" && step !== "thank-you" && (
                    <button
                      onClick={() => {
                        if (step === "it-wizard" && itStep > 0) {
                          // Let the IT calculator handle its own back navigation
                          return;
                        }
                        if (step === "web-contact") {
                          setStep("web-select-tier");
                          return;
                        }
                        setStep("select-service");
                        setServicePath(null);
                        setItStep(0);
                        setSelectedTier(null);
                      }}
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <span className="text-sm font-medium text-white/50">
                    {servicePath === "it-support"
                      ? "IT Support Quote"
                      : servicePath === "web-development"
                        ? "Web Development Quote"
                        : "Get a Free Quote"}
                  </span>
                </div>

                {/* Close */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              {step !== "select-service" && (
                <div className="max-w-6xl mx-auto px-6 pb-4">
                  <div className="flex items-center justify-between text-xs font-medium text-white/40 mb-2">
                    <span>{progress.label}</span>
                    <span>{Math.round(progress.percent)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-dark-overlay overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {/* ════════════════════════════════════════════════════════════
                    STEP: Select Service
                    ════════════════════════════════════════════════════════════ */}
                {step === "select-service" && (
                  <motion.div
                    key="select-service"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24"
                  >
                    <div className="text-center space-y-4 mb-12">
                      <p className="text-eyebrow uppercase tracking-widest text-seed-400">
                        Free Quote
                      </p>
                      <h1 className="font-display text-title md:text-display text-white">
                        What Can We Help With?
                      </h1>
                      <p className="text-body-lg text-light-base/50 max-w-xl mx-auto">
                        Select a service to get started with your personalized
                        quote.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {/* IT Support Card */}
                      <button
                        onClick={() => handleServiceSelect("it-support")}
                        className="group relative rounded-2xl border border-white/[0.06] bg-dark-elevated p-8 text-left transition-all duration-300 hover:border-seed-600/40 hover:shadow-pricingHighlight hover:-translate-y-1"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-seed-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative space-y-5">
                          <div className="w-16 h-16 rounded-2xl bg-seed-600/10 border border-seed-600/20 flex items-center justify-center">
                            <Monitor className="w-8 h-8 text-seed-400" />
                          </div>
                          <div>
                            <h3 className="font-display text-subheading text-white mb-2">
                              IT Support
                            </h3>
                            <p className="text-body-sm text-light-base/50 leading-relaxed">
                              Managed IT support with per-user pricing.
                              Get an instant quote with our interactive
                              calculator.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-seed-400 group-hover:gap-3 transition-all">
                            Configure your plan
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Web Development Card */}
                      <button
                        onClick={() => handleServiceSelect("web-development")}
                        className="group relative rounded-2xl border border-white/[0.06] bg-dark-elevated p-8 text-left transition-all duration-300 hover:border-brand-blue/40 hover:shadow-glowBlue hover:-translate-y-1"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative space-y-5">
                          <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-brand-blue" />
                          </div>
                          <div>
                            <h3 className="font-display text-subheading text-white mb-2">
                              Web Development
                            </h3>
                            <p className="text-body-sm text-light-base/50 leading-relaxed">
                              Professional websites and web applications.
                              Choose a package that fits your business.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-brand-blue group-hover:gap-3 transition-all">
                            Browse packages
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP: IT Support Wizard
                    ════════════════════════════════════════════════════════════ */}
                {step === "it-wizard" && (
                  <motion.div
                    key="it-wizard"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <QuotePriceCalculator
                      view="customer"
                      currentStep={itStep}
                      setCurrentStep={setItStep}
                      renderSubmitActions={(data) => (
                        <button
                          onClick={handleItSubmit}
                          disabled={data.isSubmitDisabled}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Submit Quote Request
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    />
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP: Web Dev — Select Tier
                    ════════════════════════════════════════════════════════════ */}
                {step === "web-select-tier" && (
                  <motion.div
                    key="web-select-tier"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-6xl mx-auto px-6 py-16"
                  >
                    <div className="text-center space-y-4 mb-12">
                      <h2 className="font-display text-heading md:text-title text-white">
                        Choose a Package
                      </h2>
                      <p className="text-body-lg text-light-base/50 max-w-2xl mx-auto">
                        Select the option that best fits your project. Every
                        package is tailored to your goals.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {webDevTiers.map((tier) => (
                        <button
                          key={tier.name}
                          onClick={() => handleTierSelect(tier.name)}
                          className={cn(
                            "group relative rounded-2xl border p-7 text-left transition-all duration-300 hover:-translate-y-1",
                            tier.highlighted
                              ? "bg-dark-elevated border-seed-600/40 shadow-pricingHighlight hover:shadow-glowSeedLg"
                              : "bg-dark-elevated border-white/[0.06] hover:border-white/[0.12] hover:shadow-elevated",
                            selectedTier === tier.name &&
                              "ring-2 ring-seed-500 border-seed-600/60"
                          )}
                        >
                          {tier.highlighted && (
                            <div className="absolute -top-3 left-7">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-brand text-white shadow-glowSeed">
                                Most Popular
                              </span>
                            </div>
                          )}

                          <div className="space-y-4">
                            {/* Name + price */}
                            <div>
                              <h3 className="font-display text-card-title text-white mb-1">
                                {tier.name}
                              </h3>
                              <p className="font-display text-subheading text-seed-400">
                                Starting at {tier.starting}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-body-sm text-light-base/50 leading-relaxed">
                              {tier.description}
                            </p>

                            {/* Includes */}
                            <ul className="space-y-1.5">
                              {tier.includes.slice(0, 4).map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-seed-500 shrink-0 mt-0.5" />
                                  <span className="text-light-base/60">
                                    {item}
                                  </span>
                                </li>
                              ))}
                              {tier.includes.length > 4 && (
                                <li className="text-xs text-white/30 pl-5">
                                  +{tier.includes.length - 4} more
                                </li>
                              )}
                            </ul>

                            {/* Best for pills */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {tier.bestFor.map((item) => (
                                <span
                                  key={item}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-white/50"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>

                            {/* CTA hint */}
                            <div className="flex items-center gap-2 text-sm font-medium text-seed-400 group-hover:gap-3 transition-all pt-1">
                              Select this package
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Back */}
                    {!preselectedService && (
                      <div className="flex justify-center mt-10">
                        <button
                          onClick={() => {
                            setStep("select-service");
                            setServicePath(null);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Back to services
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP: Web Dev — Contact Form
                    ════════════════════════════════════════════════════════════ */}
                {step === "web-contact" && (
                  <motion.div
                    key="web-contact"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-3xl mx-auto px-6 py-16"
                  >
                    <div className="text-center space-y-4 mb-10">
                      <h2 className="font-display text-heading text-white">
                        Tell Us About Your Project
                      </h2>
                      <p className="text-body-sm text-light-base/50">
                        Selected:{" "}
                        <span className="font-semibold text-seed-400">
                          {selectedTier}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-dark-elevated border border-white/[0.06] p-6 md:p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FlowInput
                          id="web-fullName"
                          label="Full Name"
                          type="text"
                          value={webForm.fullName}
                          onChange={(e) =>
                            setWebForm((f) => ({
                              ...f,
                              fullName: e.target.value,
                            }))
                          }
                          placeholder="Jane Doe"
                        />
                        <FlowInput
                          id="web-email"
                          label="Email"
                          type="email"
                          value={webForm.email}
                          onChange={(e) =>
                            setWebForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          placeholder="jane@company.com"
                        />
                        <FlowInput
                          id="web-phone"
                          label="Phone"
                          type="tel"
                          value={webForm.phone}
                          onChange={(e) =>
                            setWebForm((f) => ({
                              ...f,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="(123) 456-7890"
                        />
                        <FlowInput
                          id="web-businessName"
                          label="Business Name"
                          type="text"
                          value={webForm.businessName}
                          onChange={(e) =>
                            setWebForm((f) => ({
                              ...f,
                              businessName: e.target.value,
                            }))
                          }
                          placeholder="Acme Inc."
                        />
                      </div>
                      <FlowInput
                        id="web-siteUrl"
                        label="Current Website URL (optional)"
                        type="url"
                        value={webForm.currentSiteUrl}
                        onChange={(e) =>
                          setWebForm((f) => ({
                            ...f,
                            currentSiteUrl: e.target.value,
                          }))
                        }
                        placeholder="https://example.com"
                      />
                      <FlowTextarea
                        id="web-notes"
                        label="Project Details / Notes (optional)"
                        value={webForm.notes}
                        onChange={(e) =>
                          setWebForm((f) => ({
                            ...f,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Tell us about your goals, timeline, or anything else…"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-10">
                      <button
                        onClick={() => setStep("web-select-tier")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                      <button
                        onClick={handleWebSubmit}
                        disabled={!isWebFormValid}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Submit Quote Request
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP: Thank You
                    ════════════════════════════════════════════════════════════ */}
                {step === "thank-you" && (
                  <motion.div
                    key="thank-you"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl mx-auto px-6 py-20 md:py-28"
                  >
                    <div className="text-center space-y-6">
                      {/* Success icon */}
                      <div className="mx-auto w-20 h-20 rounded-full bg-seed-600/15 border border-seed-600/30 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-seed-400" />
                      </div>

                      <div className="space-y-3">
                        <h2 className="font-display text-title text-white">
                          Thank You!
                        </h2>
                        <p className="text-body-lg text-light-base/50 max-w-md mx-auto">
                          Your quote request has been received. Here&apos;s
                          what happens next.
                        </p>
                      </div>

                      {/* Next steps */}
                      <div className="rounded-2xl bg-dark-elevated border border-white/[0.06] p-6 md:p-8 text-left space-y-5 mt-8">
                        <h3 className="font-display text-card-title text-white">
                          Next Steps
                        </h3>
                        {[
                          {
                            icon: Mail,
                            title: "Check your inbox",
                            desc: "You'll receive a confirmation email with your quote details shortly.",
                          },
                          {
                            icon: Calendar,
                            title: "We'll reach out within 24 hours",
                            desc: "A member of our team will contact you to discuss your project and answer any questions.",
                          },
                          {
                            icon: Phone,
                            title: "Free consultation call",
                            desc: "We'll schedule a quick call to understand your needs and put together a tailored proposal.",
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="flex items-start gap-4"
                          >
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-seed-600/10 border border-seed-600/20 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-seed-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {item.title}
                              </p>
                              <p className="text-body-sm text-light-base/50 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                          onClick={handleClose}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
                        >
                          Back to Site
                        </button>
                        <a
                          href="mailto:hello@seedtech.com"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.10] transition-all"
                        >
                          <Mail className="w-4 h-4" />
                          Email Us Directly
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
