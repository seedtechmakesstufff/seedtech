
"use client";

import { AnimatedCounter } from "./animated-counter";
import { cn } from "@/lib/utils";
import { ArrowRight, BookCheck, Check, X, ChevronDown } from "lucide-react";
import { type Plan } from "@/lib/plans";
import { type ViewMode } from "@/components/quote-generator/types";
import { useState } from "react";

type PlanCardProps = {
  plan: Plan;
  calcs: {
    monthlyCommission?: number;
    yearlyCommission?: number;
    monthlyCost: number;
    yearlyCost: number;
    savings?: number;
  };
  isSelected: boolean;
  onClick: () => void;
  view: ViewMode;
  seats: number;
};

export function PlanCard({ plan, calcs, isSelected, onClick, view, seats }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const displaySavings = Math.max(0, calcs.savings || 0);
  const showCost = seats <= 320;
  const { name, description, Icon } = plan;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-dark-elevated p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full",
        isSelected
          ? "border-seed-600/60 shadow-pricingHighlight"
          : "border-white/[0.06] hover:border-seed-600/30 hover:shadow-glowSeed"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {Icon && <Icon className="w-8 h-8 text-seed-400 shrink-0" />}
        <div>
          <h3 className="font-display text-card-title text-white">{name}</h3>
          <p className="text-body-sm text-light-base/50">{description}</p>
        </div>
      </div>

      {/* Per-seat price */}
      <div className="mb-4 pb-4 border-b border-white/[0.06]">
        <span className="text-2xl font-bold tracking-tight text-white">${plan.price}</span>
        <span className="text-sm text-light-base/40 ml-1">/seat/mo</span>
      </div>

      {/* Metrics */}
      <div className="space-y-3 flex-grow">
        {view === "sales" &&
          calcs.yearlyCommission !== undefined &&
          calcs.monthlyCommission !== undefined && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-seed-600/10 border border-seed-600/20">
                <p className="text-xs text-light-base/50">Full Year Commission</p>
                <p className="text-2xl font-bold tracking-tight text-seed-400">
                  <AnimatedCounter value={calcs.yearlyCommission} prefix="$" />
                </p>
              </div>
              <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
                <p className="text-xs text-light-base/50">Monthly Commission</p>
                <p className="text-xl font-bold tracking-tight text-white">
                  <AnimatedCounter value={calcs.monthlyCommission} prefix="$" />
                </p>
              </div>
            </div>
          )}

        {showCost ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-seed-400/10 border border-seed-400/15">
              <p className="text-xs text-light-base/50">Est. Monthly Cost</p>
              <p className="text-xl font-bold tracking-tight text-white">
                <AnimatedCounter value={calcs.monthlyCost} prefix="$" />
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
              <p className="text-xs text-light-base/50">Est. Yearly Cost</p>
              <p className="text-xl font-bold tracking-tight text-white">
                <AnimatedCounter value={calcs.yearlyCost} prefix="$" />
              </p>
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-light-base/40">
            See your estimated costs and savings below.
          </p>
        )}

        {showCost && view === "customer" && calcs.savings !== undefined && (
          <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20">
            <p className="text-xs text-light-base/50">How much you save vs a Full-Time Hire (est.)</p>
            <p className="text-xl font-bold tracking-tight text-brand-cyan">
              <AnimatedCounter value={displaySavings} prefix="$" decimals={0} />
            </p>
          </div>
        )}

        {/* Expandable features */}
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <span className="font-medium">What&apos;s Included</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
          {expanded && (
            <ul className="space-y-2 text-sm text-light-base/50 pt-2 pb-2 animate-fade-in">
              {Object.entries(plan.features).map(([feature, value]) => (
                <li key={feature} className="flex items-start gap-2">
                  {value === true ||
                  (typeof value === "string" &&
                    value.toLowerCase() === "included") ? (
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-seed-400" />
                  ) : value === false ? (
                    <X className="w-4 h-4 mt-0.5 shrink-0 text-white/20" />
                  ) : (
                    <BookCheck className="w-4 h-4 mt-0.5 shrink-0 text-seed-400" />
                  )}
                  <span>
                    <strong
                      className={
                        value === false
                          ? "font-normal text-white/20 line-through"
                          : "font-semibold text-white/70"
                      }
                    >
                      {feature}:
                    </strong>
                    {typeof value === "string" &&
                      value.toLowerCase() !== "included" &&
                      ` ${value}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <button
          onClick={onClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white text-sm font-medium hover:shadow-glowSeed transition-all duration-200"
        >
          Select Plan
          <ArrowRight className="w-4 h-4" />
        </button>
        {!showCost && (
          <div className="p-3 text-center rounded-xl bg-dark-overlay mt-3">
            <p className="font-semibold text-xs text-light-base/50">
              For teams larger than 320, we&apos;ll provide a custom quote after you
              request a follow-up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
