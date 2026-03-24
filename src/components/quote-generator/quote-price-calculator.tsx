"use client";

/**
 * QuotePriceCalculator — a reusable 4-step pricing wizard.
 *
 * Adapted for the SeedTech design system. Uses native kit components
 * (GlassCard, ElevatedCard, Badge, FormInput, etc.) and the project's
 * Tailwind tokens instead of shadcn/ui.
 */

import { useState, useMemo, useEffect } from "react";
import { PlanCard } from "@/components/plan-card";
import { AnimatedCounter } from "@/components/animated-counter";
import {
  Smartphone,
  BookCheck,
  ArrowRight,
  ArrowLeft,
  X as XIcon,
} from "lucide-react";
import {
  newPlans,
  oldPlans as defaultOldPlans,
  mdmAddon as defaultMdmAddon,
} from "@/lib/plans";
import { calculateCommissions, getCommissionRate } from "@/lib/calculators/commission";
import { calculateQuote } from "@/lib/calculators/quote";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { validateEmail } from "@/lib/validation";

import type { ViewMode, PlanName, QuoteCalculatorConfig } from "./types";

// ─── Props ──────────────────────────────────────────────────────────────────
export interface QuotePriceCalculatorProps {
  view: ViewMode;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  config?: QuoteCalculatorConfig;
  initialData?: {
    clientName: string;
    fullName: string;
    email: string;
    phone: string;
  };
  renderSubmitActions?: (data: {
    selectedPlan: PlanName;
    seats: number;
    includeMdm: boolean;
    mdmSeats: number;
    clientName: string;
    fullName: string;
    email: string;
    phone: string;
    dealNotes: string;
    yearlyCost: number;
    mdmMonthlyCost: number;
    isSubmitDisabled: boolean;
  }) => React.ReactNode;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function SeedInput({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-white/70">
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

function SeedTextarea({
  id,
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="space-y-2 flex flex-col flex-grow">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={6}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none flex-grow",
          "bg-dark-overlay border border-white/[0.06] text-white placeholder:text-white/30",
          "focus:border-seed-600/50 focus:shadow-glowSeed",
          className
        )}
        {...props}
      />
    </div>
  );
}

function SeedSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1 h-2 rounded-full appearance-none bg-dark-overlay cursor-pointer accent-seed-500"
    />
  );
}

function SeedSwitch({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-seed-600" : "bg-dark-overlay"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export function QuotePriceCalculator({
  view,
  currentStep,
  setCurrentStep,
  config = {},
  initialData,
  renderSubmitActions,
}: QuotePriceCalculatorProps) {
  const plans = config.plans ?? newPlans;
  const oldPlansList = config.oldPlans ?? defaultOldPlans;
  const mdmAddon = config.mdmAddon ?? defaultMdmAddon;

  // ── Form state ──
  const [seats, setSeats] = useState(10);
  const [mdmSeats, setMdmSeats] = useState(4);
  const [clientName, setClientName] = useState("");
  const [dealNotes, setDealNotes] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanName | null>(null);
  const [includeMdm, setIncludeMdm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [itEmailError, setItEmailError] = useState("");
  const [itEmailSuggestion, setItEmailSuggestion] = useState("");

  useEffect(() => {
    if (initialData) {
      setClientName(initialData.clientName || "");
      setFullName(initialData.fullName || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
    }
  }, [initialData]);

  // ── Derived calculations ──
  const commissionRate = useMemo(() => getCommissionRate(seats), [seats]);

  const mdmMonthlyCost = useMemo(
    () => (includeMdm ? mdmSeats * 12 : 0),
    [includeMdm, mdmSeats]
  );

  const calculations = useMemo(() => {
    if (view === "sales") {
      return calculateCommissions(seats, commissionRate, mdmMonthlyCost);
    }
    return calculateQuote(seats, mdmMonthlyCost);
  }, [seats, commissionRate, mdmMonthlyCost, view]);

  const plansWithCalcs = useMemo(() => {
    return plans.map((plan) => {
      let calcs;
      if (plan.name === "SeedCare Essentials") calcs = calculations.seedcare;
      else if (plan.name === "SeedCare Plus")
        calcs = calculations.seedcarePlus;
      else calcs = calculations.seedcarePro;
      return { ...plan, calcs };
    });
  }, [calculations, plans]);

  const planData = {
    "SeedCare Essentials": calculations.seedcare,
    "SeedCare Plus": calculations.seedcarePlus,
    "SeedCare Pro": calculations.seedcarePro,
  };

  const isSubmitDisabled =
    !selectedPlan || !clientName || !fullName || !email || !phone || !validateEmail(email).valid;

  // ── Handlers ──
  const handlePlanSelect = (planName: PlanName) => {
    setSelectedPlan(planName);
    setCurrentStep(1);
    setMdmSeats(seats);
  };

  // ── Shared animation ──
  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: -20,
      position: "absolute" as const,
      width: "100%",
    },
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* ── Step 0: Plan Selection ── */}
        <AnimatePresence>
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="space-y-10">
                <div className="max-w-2xl mx-auto space-y-6 text-center">
                  <h2 className="font-display text-heading text-white">
                    How many team members need a seat?
                  </h2>
                  <p className="text-body-sm text-light-base/50">
                    Select a plan below that best fits your needs. We&apos;ll schedule
                    a free consultation upon completion.
                  </p>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-elevated border border-white/[0.06]">
                    <input
                      type="number"
                      min={1}
                      max={321}
                      value={seats}
                      onChange={(e) =>
                        setSeats(Math.max(1, Number(e.target.value)))
                      }
                      className="text-2xl font-bold h-14 w-28 text-center rounded-xl bg-dark-overlay border border-white/[0.06] text-white outline-none focus:border-seed-600/50"
                    />
                    <SeedSlider
                      value={seats}
                      onChange={setSeats}
                      min={1}
                      max={321}
                    />
                  </div>
                  {view === "sales" && (
                    <div className="flex justify-center items-center gap-4 pt-2">
                      <span className="text-sm font-medium text-white/70">
                        Commission Rate
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-seed-600/20 text-seed-400">
                        {commissionRate}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plansWithCalcs.map((plan) => (
                    <PlanCard
                      key={plan.name}
                      plan={plan}
                      calcs={plan.calcs}
                      isSelected={false}
                      onClick={() =>
                        handlePlanSelect(plan.name as PlanName)
                      }
                      view={view}
                      seats={seats}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowComparison(true)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/[0.10] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    Compare with Legacy Plans
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 1: Add-ons ── */}
        <AnimatePresence>
          {currentStep === 1 && selectedPlan && (
            <motion.div
              key="step-1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="font-display text-heading text-white">
                  Add-Ons
                </h2>
                <p className="text-body-sm text-light-base/50 max-w-3xl mx-auto">
                  {mdmAddon.description}
                </p>
              </div>

              <div className="max-w-2xl mx-auto rounded-2xl bg-dark-elevated border border-white/[0.06] overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-8 h-8 text-seed-400 shrink-0" />
                    <div>
                      <h3 className="font-display text-card-title text-white">
                        {mdmAddon.name}
                      </h3>
                      <p className="text-body-sm text-light-base/50">
                        For iOS/iPadOS devices
                      </p>
                    </div>
                  </div>
                  <SeedSwitch
                    id="mdm-switch"
                    checked={includeMdm}
                    onChange={setIncludeMdm}
                  />
                </div>
                <AnimatePresence>
                  {includeMdm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 space-y-4">
                        <div className="border-t border-white/[0.06] pt-4">
                          <label className="text-sm font-medium text-white/70">
                            How many devices need MDM?
                          </label>
                          <div className="flex items-center gap-4 mt-3">
                            <input
                              type="number"
                              min={0}
                              max={1000}
                              value={mdmSeats}
                              onChange={(e) =>
                                setMdmSeats(
                                  Math.max(0, Number(e.target.value))
                                )
                              }
                              className="text-2xl font-bold h-14 w-28 text-center rounded-xl bg-dark-overlay border border-white/[0.06] text-white outline-none focus:border-seed-600/50"
                            />
                            <SeedSlider
                              value={mdmSeats}
                              onChange={setMdmSeats}
                              min={0}
                              max={1000}
                            />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-seed-600/10 border border-seed-600/20 text-center">
                          <p className="text-xs text-light-base/50">
                            Additional Monthly Cost
                          </p>
                          <p className="text-2xl font-bold tracking-tight text-white">
                            <AnimatedCounter
                              value={mdmMonthlyCost}
                              prefix="$"
                            />
                          </p>
                        </div>
                        <ul className="space-y-2 text-sm text-light-base/50">
                          {mdmAddon.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2"
                            >
                              <BookCheck className="w-4 h-4 mt-0.5 shrink-0 text-seed-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setSelectedPlan(null);
                    setCurrentStep(0);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
                >
                  Continue to Your Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 2: Contact Details ── */}
        <AnimatePresence>
          {currentStep === 2 && selectedPlan && (
            <motion.div
              key="step-2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="font-display text-heading text-white">
                  {view === "customer"
                    ? "Let's Get in Touch"
                    : "Enter Deal Information"}
                </h2>
                <p className="text-body-sm text-light-base/50">
                  Selected Plan:{" "}
                  <span className="font-semibold text-seed-400">
                    {selectedPlan}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-seed-400">{seats}</span>{" "}
                  seats.
                </p>
              </div>

              <div className="rounded-2xl bg-dark-elevated border border-white/[0.06] p-6 md:p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <SeedInput
                      id="clientName"
                      label="Company Name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Acme Inc."
                    />
                    <SeedInput
                      id="fullName"
                      label="Full Name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                    />
                    <SeedInput
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setItEmailError(""); setItEmailSuggestion(""); }}
                      onBlur={() => {
                        if (!email) return;
                        const r = validateEmail(email);
                        if (!r.valid) { setItEmailError(r.error || "Invalid email."); setItEmailSuggestion(r.suggestion || ""); }
                      }}
                      placeholder="e.g., jane.doe@example.com"
                      className={itEmailError ? "border-red-500/50" : ""}
                    />
                    {itEmailError && (
                      <div className="-mt-3 px-1 col-span-full">
                        <p className="text-red-400 text-xs">{itEmailError}</p>
                        {itEmailSuggestion && (
                          <button type="button" onClick={() => { setEmail(itEmailSuggestion); setItEmailError(""); setItEmailSuggestion(""); }} className="text-seed-400 hover:text-seed-300 text-xs underline underline-offset-2 mt-0.5">
                            Did you mean {itEmailSuggestion}?
                          </button>
                        )}
                      </div>
                    )}
                    <SeedInput
                      id="phone"
                      label="Phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., (123) 456-7890"
                    />
                  </div>
                  <SeedTextarea
                    id="dealNotes"
                    label="Questions / Notes"
                    value={dealNotes}
                    onChange={(e) => setDealNotes(e.target.value)}
                    placeholder={
                      view === "customer"
                        ? "Tell us about your needs..."
                        : "e.g., Interested in Pro plan for their design team..."
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isSubmitDisabled}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Review
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 3: Review & Submit ── */}
        <AnimatePresence>
          {currentStep === 3 && selectedPlan && (
            <motion.div
              key="step-3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="font-display text-heading text-white">
                  Review &amp; Submit
                </h2>
                <p className="text-body-sm text-light-base/50">
                  You&apos;re almost there! Review your details and submit your
                  request.
                </p>
              </div>

              <div className="max-w-2xl mx-auto rounded-2xl bg-dark-elevated border border-white/[0.06] p-6 space-y-4">
                <h3 className="font-display text-card-title text-white mb-4">
                  Your Quote Request
                </h3>
                {[
                  { label: "Plan", value: selectedPlan, accent: true },
                  { label: "Seats", value: String(seats) },
                  {
                    label: "MDM Add-On",
                    value: includeMdm
                      ? `Yes (${mdmSeats} devices)`
                      : "No",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-light-base/50">{row.label}</span>
                    <span
                      className={cn(
                        "font-semibold",
                        row.accent ? "text-seed-400" : "text-white"
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                {includeMdm && (
                  <div className="flex justify-between text-sm">
                    <span className="text-light-base/50">
                      MDM Monthly Cost
                    </span>
                    <span className="font-semibold text-white">
                      <AnimatedCounter
                        value={mdmMonthlyCost}
                        prefix="$"
                      />
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/[0.06]">
                  <span className="text-white">Est. Yearly Cost</span>
                  <span className="text-seed-400">
                    <AnimatedCounter
                      value={planData[selectedPlan].yearlyCost}
                      prefix="$"
                    />
                  </span>
                </div>
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  {[
                    { label: "Name", value: fullName },
                    { label: "Company", value: clientName },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-light-base/50">{row.label}</span>
                      <span className="font-semibold text-white">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                {dealNotes && (
                  <div className="pt-2">
                    <p className="font-semibold text-sm text-white mb-2">
                      Notes:
                    </p>
                    <p className="text-sm text-light-base/50 p-3 bg-dark-overlay rounded-xl">
                      {dealNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                {renderSubmitActions ? (
                  renderSubmitActions({
                    selectedPlan,
                    seats,
                    includeMdm,
                    mdmSeats,
                    clientName,
                    fullName,
                    email,
                    phone,
                    dealNotes,
                    yearlyCost: planData[selectedPlan].yearlyCost,
                    mdmMonthlyCost,
                    isSubmitDisabled,
                  })
                ) : (
                  <a
                    href={`mailto:${config.companyEmail ?? "hello@seedtech.com"}?subject=IT Support Quote Request — ${clientName}&body=Plan: ${selectedPlan}%0ASeats: ${seats}%0AMDM: ${includeMdm ? `Yes (${mdmSeats} devices)` : "No"}%0AName: ${fullName}%0ACompany: ${clientName}%0AEmail: ${email}%0APhone: ${phone}%0ANotes: ${dealNotes}`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
                  >
                    Request Follow-Up
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Comparison Dialog ── */}
      {showComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowComparison(false)}
          />
          <div className="relative z-10 w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-2xl bg-dark-elevated border border-white/[0.06] shadow-elevated p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-heading text-white">
                  Plan Comparison: Legacy vs. New
                </h3>
                <p className="text-body-sm text-light-base/50 mt-1">
                  See what&apos;s changed and the new value we&apos;re providing.
                </p>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-2 font-bold text-white">
                      Feature
                    </th>
                    <th className="text-left py-3 px-2 text-white/50">
                      {oldPlansList[0].name}
                      <br />
                      <span className="font-normal text-xs">
                        ${oldPlansList[0].price}/PC
                      </span>
                    </th>
                    <th className="text-left py-3 px-2 text-seed-400">
                      {plans[0].name}
                      <br />
                      <span className="font-normal text-xs">
                        ${plans[0].price}/user
                      </span>
                    </th>
                    <th className="text-left py-3 px-2 text-white/50">
                      {oldPlansList[1].name}
                      <br />
                      <span className="font-normal text-xs">
                        ${oldPlansList[1].price}/PC
                      </span>
                    </th>
                    <th className="text-left py-3 px-2 text-seed-400">
                      {plans[1].name}
                      <br />
                      <span className="font-normal text-xs">
                        ${plans[1].price}/user
                      </span>
                    </th>
                    <th className="text-left py-3 px-2 text-seed-400">
                      {plans[2].name}
                      <br />
                      <span className="font-normal text-xs">
                        ${plans[2].price}/user
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(plans[2].features).map((featureKey) => (
                    <tr
                      key={featureKey}
                      className="border-b border-white/[0.04]"
                    >
                      <td className="py-2.5 px-2 font-medium text-white/70">
                        {featureKey}
                      </td>
                      <td className="py-2.5 px-2 text-white/40">
                        {(
                          oldPlansList[0].features as Record<
                            string,
                            string | boolean
                          >
                        )[featureKey]?.toString() || "N/A"}
                      </td>
                      <td className="py-2.5 px-2 text-white/70">
                        {plans[0].features[featureKey] === true
                          ? "✓"
                          : plans[0].features[featureKey] === false
                            ? "—"
                            : (plans[0].features[featureKey] as string)}
                      </td>
                      <td className="py-2.5 px-2 text-white/40">
                        {(
                          oldPlansList[1].features as Record<
                            string,
                            string | boolean
                          >
                        )[featureKey]?.toString() || "N/A"}
                      </td>
                      <td className="py-2.5 px-2 text-white/70">
                        {plans[1].features[featureKey] === true
                          ? "✓"
                          : plans[1].features[featureKey] === false
                            ? "—"
                            : (plans[1].features[featureKey] as string)}
                      </td>
                      <td className="py-2.5 px-2 text-white/70">
                        {plans[2].features[featureKey] === true
                          ? "✓"
                          : plans[2].features[featureKey] === false
                            ? "—"
                            : (plans[2].features[featureKey] as string)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
