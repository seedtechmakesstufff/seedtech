
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { QuotePriceCalculator } from "./quote-price-calculator";
import type { QuoteCalculatorConfig } from "./types";

type QuoteGeneratorModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  leadData: {
    clientName: string;
    fullName: string;
    email: string;
    phone: string;
  };
  config?: QuoteCalculatorConfig;
};

const steps = [
  { name: "Plan", fields: ["plan"] },
  { name: "Add-Ons", fields: [] },
  { name: "Details", fields: ["name", "email"] },
  { name: "Submit", fields: [] },
];

export function QuoteGeneratorModal({
  isOpen,
  setIsOpen,
  leadData,
  config,
}: QuoteGeneratorModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const progressValue = (currentStep / (steps.length - 1)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 flex flex-col w-full h-full max-w-7xl mx-auto bg-dark-base overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-full max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-6">
          <div className="text-center space-y-3">
            <h2 className="font-display text-title md:text-display text-white">
              Instant Price Quote
            </h2>
            <p className="text-body-lg text-light-base/50 max-w-3xl mx-auto">
              Follow the steps below to get an instant price quote for your
              team.
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xl mx-auto space-y-3">
            <div className="flex justify-between items-center text-sm font-medium text-white/70">
              <span>
                Step {currentStep + 1} of {steps.length}:{" "}
                {steps[currentStep].name}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-dark-overlay overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>

        {/* Calculator */}
        <QuotePriceCalculator
          view="customer"
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          initialData={leadData}
          config={config}
        />
      </div>
    </div>
  );
}
