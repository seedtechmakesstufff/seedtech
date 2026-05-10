"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Minus, Plus, Smartphone, Wifi } from "lucide-react";
import { mdmAddon, newPlans } from "@/lib/plans";
import { COMMISSION_LADDER, getCommissionRate } from "@/lib/calculators/commission";
import { FAILOVER_PRICE_PER_LOCATION } from "@/lib/calculators/constants";

const planNames = [
  "SeedCare Essentials",
  "SeedCare Plus",
  "SeedCare Pro",
] as const;

type PlanName = (typeof planNames)[number];

const planPriceByName: Record<PlanName, number> = {
  "SeedCare Essentials":
    newPlans.find((p) => p.name === "SeedCare Essentials")?.price ?? 110,
  "SeedCare Plus":
    newPlans.find((p) => p.name === "SeedCare Plus")?.price ?? 130,
  "SeedCare Pro":
    newPlans.find((p) => p.name === "SeedCare Pro")?.price ?? 160,
};

const planTaglines: Record<PlanName, string> = {
  "SeedCare Essentials": "Foundational support and protection.",
  "SeedCare Plus": "The best default for growing SMBs.",
  "SeedCare Pro": "Strategic partnership for higher-touch clients.",
};

const industryProfiles = {
  construction: {
    label: "Construction / Trades",
    recommendedPlan: "SeedCare Plus" as PlanName,
  },
  trucking: {
    label: "Trucking / Logistics",
    recommendedPlan: "SeedCare Plus" as PlanName,
  },
  law: {
    label: "Law Firms",
    recommendedPlan: "SeedCare Pro" as PlanName,
  },
  medical: {
    label: "Medical / Dental",
    recommendedPlan: "SeedCare Pro" as PlanName,
  },
} as const;

type IndustryKey = keyof typeof industryProfiles;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function Stepper({
  value,
  onChange,
  min = 0,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-dark-base text-white/60 transition hover:border-white/25 hover:text-white active:scale-95"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-10 text-center font-display text-2xl text-white">{value}</span>
      <button
        type="button"
        onClick={() =>
          onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)
        }
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-dark-base text-white/60 transition hover:border-white/25 hover:text-white active:scale-95"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function SalesRepCalculator() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>("construction");
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("SeedCare Plus");
  const [seats, setSeats] = useState(18);
  const [editingSeats, setEditingSeats] = useState(false);
  const [seatsInput, setSeatsInput] = useState("18");
  const seatsInputRef = useRef<HTMLInputElement>(null);
  const [mdmDevices, setMdmDevices] = useState(8);
  const [failoverLocations, setFailoverLocations] = useState(1);

  const commissionRate = getCommissionRate(seats);

  // What the client pays (shown on plan cards as Est. Monthly/Year Cost)
  const mdmClientMonthly = mdmDevices * mdmAddon.pricePerDevice;
  const failoverClientMonthly = failoverLocations * FAILOVER_PRICE_PER_LOCATION;
  const addOnClientMonthly = mdmClientMonthly + failoverClientMonthly;

  // What counts toward the rep's commission base ($3/device, $10/location)
  const MDM_COMMISSION_PER_DEVICE = 3;
  const FAILOVER_COMMISSION_PER_LOCATION = 10;
  const mdmCommissionable = mdmDevices * MDM_COMMISSION_PER_DEVICE;
  const failoverCommissionable = failoverLocations * FAILOVER_COMMISSION_PER_LOCATION;
  const addOnCommissionable = mdmCommissionable + failoverCommissionable;

  const industryProfile = industryProfiles[selectedIndustry];

  const selectedCommissionBase = seats * planPriceByName[selectedPlan] + addOnCommissionable;
  const _selectedClientMonthly = seats * planPriceByName[selectedPlan] + addOnClientMonthly;
  const selectedMonthlyPayout = (selectedCommissionBase * commissionRate) / 100;
  const _selectedYearlyPayout = selectedMonthlyPayout * 12;

  return (
    <div className="space-y-4">

      {/* ── Seat slider + market + rate ── */}
      <div className="rounded-[2rem] border border-dark-base/10 bg-dark-elevated px-6 py-7 shadow-[0_8px_48px_-8px_rgba(10,10,15,0.3)] md:px-8 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white">
              How many users need a seat?
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              {editingSeats ? (
                <input
                  ref={seatsInputRef}
                  type="number"
                  min={1}
                  max={150}
                  value={seatsInput}
                  onChange={(e) => setSeatsInput(e.target.value)}
                  onBlur={() => {
                    const n = Math.min(150, Math.max(1, parseInt(seatsInput, 10) || 1));
                    setSeats(n);
                    setSeatsInput(String(n));
                    setEditingSeats(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="w-36 bg-transparent font-display text-[4.5rem] leading-none text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  title="Click to edit"
                  onClick={() => {
                    setSeatsInput(String(seats));
                    setEditingSeats(true);
                    setTimeout(() => seatsInputRef.current?.select(), 0);
                  }}
                  className="group relative font-display text-[4.5rem] leading-none text-white underline decoration-white/20 decoration-dotted underline-offset-4 transition hover:decoration-white/50"
                >
                  {seats}
                </button>
              )}
              <span className="mb-1.5 text-lg text-white">users</span>
            </div>
          </div>
          <div className="rounded-2xl border border-seed-500/25 bg-seed-500/10 px-5 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-seed-400">
                Commission rate
              </p>
              <p className="mt-0.5 font-display text-[2rem] leading-none text-white">
                {commissionRate}%
              </p>
            </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <p className="w-full text-[11px] uppercase tracking-[0.18em] text-white">Target market</p>
          {(Object.entries(industryProfiles) as [IndustryKey, typeof industryProfiles[IndustryKey]][]).map(([key, val]) => {
            const isActive = selectedIndustry === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedIndustry(key)}
                className={[
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "border-seed-500/50 bg-seed-500/20 text-white shadow-[0_0_0_1px_rgba(64,166,96,0.2)]"
                    : "border-white/[0.12] bg-white/[0.05] text-white/80 hover:border-white/25 hover:text-white",
                ].join(" ")}
              >
                <span>{val.label}</span>
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] transition-colors",
                    isActive
                      ? "bg-seed-500/30 text-seed-300"
                      : "bg-white/[0.08] text-white/70",
                  ].join(" ")}
                >
                  {val.recommendedPlan.replace("SeedCare ", "")}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-6">
          <input
            type="range"
            min={1}
            max={150}
            value={seats}
            onChange={(e) => { const n = Number(e.target.value); setSeats(n); setSeatsInput(String(n)); }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-dark-base accent-seed-500"
          />
          <div className="mt-2 flex justify-between text-[11px] text-white/80">
            <span>1 user</span>
            <span>150 users</span>
          </div>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {planNames.map((planName) => {
          const isSelected = selectedPlan === planName;
          const price = planPriceByName[planName];
          const clientMonthly = seats * price + addOnClientMonthly;
          const commissionBase = seats * price + addOnCommissionable;
          const monthlyPayout = (commissionBase * commissionRate) / 100;
          const yearlyPayout = monthlyPayout * 12;
          const isRecommended = industryProfile.recommendedPlan === planName;

          return (
            <button
              key={planName}
              type="button"
              onClick={() => setSelectedPlan(planName)}
              className={[
                "group flex flex-col overflow-hidden rounded-[1.75rem] border bg-dark-elevated text-left transition-all duration-200",
                isSelected
                  ? "border-seed-500/40 shadow-[0_0_0_1px_rgba(64,166,96,0.25),0_20px_60px_-15px_rgba(64,166,96,0.2)]"
                  : "border-white/[0.07] shadow-[0_4px_24px_-4px_rgba(10,10,15,0.35)] hover:border-white/[0.12]",
              ].join(" ")}
            >
              {/* Header */}
              <div className="px-5 pb-4 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-[1.55rem] leading-tight text-white">
                      {planName}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                      {planTaglines[planName]}
                    </p>
                  </div>
                  {isRecommended && (
                    <span className="shrink-0 rounded-full border border-seed-500/25 bg-seed-500/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-seed-300">
                      Rec.
                    </span>
                  )}
                </div>
              </div>

              {/* Metric rows */}
              <div className="border-t border-black/30 bg-[#1c5c38] px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#5ab87a]">
                  Full Year Commission
                </p>
                <p className="mt-1.5 font-display text-[2rem] leading-none text-[#3ded72]">
                  {formatCurrency(yearlyPayout)}
                </p>
              </div>

              <div className="border-t border-black/30 bg-[#142c38] px-5 py-3.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#3d7e94]">
                  Monthly Commission
                </p>
                <p className="mt-1.5 font-display text-[1.5rem] leading-none text-[#cce8f4]">
                  {formatCurrency(monthlyPayout)}
                </p>
              </div>

              <div className="border-t border-black/30 bg-[#302800] px-5 py-3.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#9c8828]">
                  Est. Monthly Cost
                </p>
                <p className="mt-1.5 font-display text-[1.5rem] leading-none text-[#d4b030]">
                  {formatCurrency(clientMonthly)}
                </p>
              </div>

              <div className="border-t border-black/30 bg-[#181838] px-5 py-3.5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#5858a8]">
                  Est. Year Cost
                </p>
                <p className="mt-1.5 font-display text-[1.5rem] leading-none text-[#9898d8]">
                  {formatCurrency(clientMonthly * 12)}
                </p>
              </div>

              {/* Select */}
              <div className="mt-auto border-t border-white/[0.06] bg-dark-elevated px-5 py-4">
                <div
                  className={[
                    "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-gradient-brand text-white"
                      : "bg-white/[0.08] text-white/80 group-hover:bg-white/[0.12] group-hover:text-white",
                  ].join(" ")}
                >
                  {isSelected && <CheckCircle2 className="h-4 w-4" />}
                  <span>{isSelected ? "Selected" : "Select Plan"}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Add-ons ── */}
      <div className="rounded-[2rem] border border-dark-base/10 bg-dark-elevated px-6 py-7 shadow-[0_8px_48px_-8px_rgba(10,10,15,0.3)] md:px-8 md:py-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-seed-400">Add-ons</p>
        <p className="mt-1 text-sm text-white/90">
          Optional recurring services that expand the commission base. Seat count still determines your rate.
        </p>
      <div className="grid gap-4 md:grid-cols-2">

          {/* MDM */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="flex gap-4 bg-dark-overlay p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">MDM Device Management</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                  Mobile device management for enrolled employee devices.
                  Policies, remote wipe, and app control — billed per enrolled device.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] text-white">
                    Client pays {formatCurrency(mdmAddon.pricePerDevice)}/device/mo
                  </span>
                  <span className="inline-flex rounded-full bg-brand-cyan/10 px-2.5 py-1 text-[11px] font-medium text-brand-cyan">
                    {formatCurrency(MDM_COMMISSION_PER_DEVICE)}/device commissionable
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-dark-base px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white">
                  Enrolled devices
                </p>
                {mdmDevices > 0 ? (
                  <p className="mt-1 text-sm font-medium text-brand-cyan">
                    +{formatCurrency(mdmCommissionable)}/mo to commission base
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-white/75">Not added</p>
                )}
              </div>
              <Stepper value={mdmDevices} onChange={setMdmDevices} max={500} />
            </div>
          </div>

          {/* 5G Failover */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="flex gap-4 bg-dark-overlay p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                <Wifi className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">5G Business Failover</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                  Automatic cellular backup that activates when the primary connection
                  drops. Keeps the business online through an outage — billed per location.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] text-white">
                    Client pays {formatCurrency(FAILOVER_PRICE_PER_LOCATION)}/location/mo
                  </span>
                  <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-1 text-[11px] font-medium text-brand-blue">
                    {formatCurrency(FAILOVER_COMMISSION_PER_LOCATION)}/location commissionable
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-dark-base px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white">
                  Locations covered
                </p>
                {failoverLocations > 0 ? (
                  <p className="mt-1 text-sm font-medium text-brand-blue">
                    +{formatCurrency(failoverCommissionable)}/mo to commission base
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-white/75">Not added</p>
                )}
              </div>
              <Stepper value={failoverLocations} onChange={setFailoverLocations} max={25} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Breakdown + Ladder ── */}
      {(() => {
        const basePlanMonthly = (seats * planPriceByName[selectedPlan] * commissionRate) / 100;
        const addOnMonthly = (addOnCommissionable * commissionRate) / 100;
        const nextTier = COMMISSION_LADDER.find((t) => t.minSeats > seats) ?? null;
        const seatsToNext = nextTier ? nextTier.minSeats - seats : null;
        const nextRate = nextTier?.rate ?? null;
        const nextYearlyGain = nextTier
          ? ((selectedCommissionBase * nextTier.rate) / 100 - selectedMonthlyPayout) * 12
          : null;
        return (
      <div className="grid gap-4 md:grid-cols-[1fr_190px]">
        {/* Commission breakdown */}
        <div className="rounded-[2rem] border border-dark-elevated/60 bg-dark-elevated px-6 py-7 md:px-8 md:py-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white">
            Where your commission comes from
          </p>

          {/* Breakdown bars */}
          <div className="mt-5 space-y-3">
            {/* Base plan */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/90">
                  {seats} seats × {selectedPlan.replace("SeedCare ", "")} plan
                </p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.10]">
                  <div
                    className="h-full rounded-full bg-seed-500/70"
                    style={{ width: `${addOnCommissionable > 0 ? Math.round((basePlanMonthly / (basePlanMonthly + addOnMonthly)) * 100) : 100}%` }}
                  />
                </div>
              </div>
              <p className="shrink-0 font-display text-[1.5rem] leading-none text-white">
                {formatCurrency(basePlanMonthly)}<span className="ml-1 text-xs text-white/70">/mo</span>
              </p>
            </div>

            {/* Add-ons */}
            {addOnCommissionable > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/90">
                    Add-ons
                    {mdmDevices > 0 && ` · ${mdmDevices} MDM`}
                    {failoverLocations > 0 && ` · ${failoverLocations} failover`}
                  </p>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.10]">
                    <div
                      className="h-full rounded-full bg-brand-cyan/60"
                      style={{ width: `${Math.round((addOnMonthly / (basePlanMonthly + addOnMonthly)) * 100)}%` }}
                    />
                  </div>
                </div>
                <p className="shrink-0 font-display text-[1.5rem] leading-none text-white">
                  {formatCurrency(addOnMonthly)}<span className="ml-1 text-xs text-white/70">/mo</span>
                </p>
              </div>
            )}
          </div>

          {/* Next-tier nudge */}
          {seatsToNext !== null && nextRate !== null && nextYearlyGain !== null && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-brand-blue/20 bg-brand-blue/[0.07] px-4 py-3">
              <p className="text-xs text-white">
                Close <span className="font-semibold text-white">{seatsToNext} more seat{seatsToNext !== 1 ? "s" : ""}</span> → unlock <span className="font-semibold text-white">{nextRate}%</span> rate
              </p>
              <p className="shrink-0 text-xs font-semibold text-brand-blue">
                +{formatCurrency(nextYearlyGain)}/yr
              </p>
            </div>
          )}

          {seatsToNext === null && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-seed-500/25 bg-seed-500/10 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-seed-400" />
              <p className="text-xs text-white">
                You&apos;re at the <span className="font-semibold text-seed-300">top tier — 20% commission</span> on every deal.
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <p className="text-xs leading-relaxed text-white/80">
              Add-ons earn at the same rate as the plan. Paid on collected MRR only. Hardware, taxes, and one-time fees excluded.
            </p>
          </div>
        </div>

        {/* Ladder */}
        <div className="rounded-[2rem] border border-dark-base/10 bg-dark-elevated px-5 py-6 shadow-[0_4px_24px_-4px_rgba(10,10,15,0.18)]">
          <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white">
            Commission ladder
          </p>
          <div className="space-y-1">
            {COMMISSION_LADDER.map((tier) => {
              const isActive =
                seats >= tier.minSeats &&
                (tier.maxSeats === null || seats <= tier.maxSeats);
              return (
                <div
                  key={`${tier.minSeats}-${tier.maxSeats ?? "plus"}`}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors",
                    isActive ? "border border-seed-500/25 bg-seed-500/15" : "",
                  ].join(" ")}
                >
                  <span className={isActive ? "text-white" : "text-white/80"}>
                    {tier.maxSeats === null
                      ? `${tier.minSeats}+`
                      : `${tier.minSeats}–${tier.maxSeats}`}
                  </span>
                  <span
                    className={
                      isActive ? "font-medium text-seed-300" : "text-white/80"
                    }
                  >
                    {tier.rate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
        );
      })()}
    </div>
  );
}

