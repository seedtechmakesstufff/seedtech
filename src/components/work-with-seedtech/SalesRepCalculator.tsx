"use client";

import { useState } from "react";
import { Calculator, Smartphone, Wifi } from "lucide-react";
import { mdmAddon, newPlans } from "@/lib/plans";
import { COMMISSION_LADDER, getCommissionRate } from "@/lib/calculators/commission";

const FAILOVER_PRICE_PER_LOCATION = 40;

const planNames = [
  "SeedCare Essentials",
  "SeedCare Plus",
  "SeedCare Pro",
] as const;

type PlanName = (typeof planNames)[number];

const planPriceByName: Record<PlanName, number> = {
  "SeedCare Essentials":
    newPlans.find((plan) => plan.name === "SeedCare Essentials")?.price ?? 110,
  "SeedCare Plus":
    newPlans.find((plan) => plan.name === "SeedCare Plus")?.price ?? 130,
  "SeedCare Pro":
    newPlans.find((plan) => plan.name === "SeedCare Pro")?.price ?? 160,
};

const planDescriptions: Record<PlanName, string> = {
  "SeedCare Essentials": "Baseline protection and support for straightforward environments.",
  "SeedCare Plus": "The best default for growing teams that need more hands-on guidance.",
  "SeedCare Pro": "A higher-touch partnership for clients who want strategy with execution.",
};

const industryProfiles = {
  construction: {
    label: "Construction / Trades",
    recommendedPlan: "SeedCare Plus" as PlanName,
    note: "Field devices, fast-moving teams, and uptime pressure usually make Plus the default starting point.",
  },
  trucking: {
    label: "Trucking / Logistics",
    recommendedPlan: "SeedCare Plus" as PlanName,
    note: "Dispatch continuity, communication issues, and driver device support make Plus a natural fit.",
  },
  law: {
    label: "Law Firms",
    recommendedPlan: "SeedCare Pro" as PlanName,
    note: "Security, responsiveness, and partner-level trust often justify the higher-touch tier quickly.",
  },
  medical: {
    label: "Medical / Dental",
    recommendedPlan: "SeedCare Pro" as PlanName,
    note: "Reliability and secure systems matter enough that Pro is often the right positioning.",
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

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-5",
        accent
          ? "border-seed-500/30 bg-seed-500/10"
          : "border-white/[0.08] bg-dark-overlay",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className={accent ? "mt-3 text-3xl font-display text-white" : "mt-3 text-2xl font-display text-white"}>
        {value}
      </p>
    </div>
  );
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-dark-base px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 text-xl font-display text-white">{value}</p>
    </div>
  );
}

export function SalesRepCalculator() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>("construction");
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("SeedCare Plus");
  const [seats, setSeats] = useState(18);
  const [mdmDevices, setMdmDevices] = useState(8);
  const [failoverLocations, setFailoverLocations] = useState(1);

  const industryProfile = industryProfiles[selectedIndustry];
  const isRecommendedPlanSelected = selectedPlan === industryProfile.recommendedPlan;
  const planPrice = planPriceByName[selectedPlan];
  const baseMonthly = seats * planPrice;
  const mdmMonthly = mdmDevices * mdmAddon.pricePerDevice;
  const failoverMonthly = failoverLocations * FAILOVER_PRICE_PER_LOCATION;
  const clientMonthly = baseMonthly + mdmMonthly + failoverMonthly;
  const clientAnnualized = clientMonthly * 12;
  const commissionRate = getCommissionRate(seats);
  const monthlyPayout = (clientMonthly * commissionRate) / 100;
  const yearlyPayout = monthlyPayout * 12;

  return (
    <div className="rounded-[2rem] border border-white/[0.08] bg-dark-elevated p-6 shadow-elevated md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-seed-500/15 text-seed-400">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Live Commission Calculator</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                  Build a realistic SeedTech deal and see both sides in real time: what the client would buy,
                  what they would pay, and what your payout could look like over 12 months.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-white/75">Target market</span>
              <select
                value={selectedIndustry}
                onChange={(event) => setSelectedIndustry(event.target.value as IndustryKey)}
                className="w-full rounded-xl border border-white/[0.08] bg-dark-overlay px-4 py-3 text-sm text-white outline-none transition focus:border-seed-500/40"
              >
                {Object.entries(industryProfiles).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-xl border border-seed-500/20 bg-seed-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-300">Recommended default package</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-display text-white">{industryProfile.recommendedPlan}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{industryProfile.note}</p>
                </div>
                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                    isRecommendedPlanSelected
                      ? "border border-seed-400/30 bg-seed-400/10 text-seed-200"
                      : "border border-white/10 bg-white/[0.04] text-white/55",
                  ].join(" ")}
                >
                  {isRecommendedPlanSelected ? "Current match" : "Recommended"}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
                Choose a plan below to compare or override the default fit.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white/75">Plan</p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {planNames.map((planName) => {
                const isSelected = selectedPlan === planName;

                return (
                  <button
                    key={planName}
                    type="button"
                    onClick={() => setSelectedPlan(planName)}
                    className={[
                      "rounded-2xl border p-5 text-left transition",
                      isSelected
                        ? "border-seed-500/40 bg-seed-500/10 shadow-glowSeed"
                        : "border-white/[0.08] bg-dark-overlay hover:border-white/[0.16]",
                    ].join(" ")}
                  >
                    <p className="text-lg font-display text-white">{planName}</p>
                    <p className="mt-2 text-sm text-white/55">{planDescriptions[planName]}</p>
                    <p className="mt-4 text-sm font-medium text-seed-300">{formatCurrency(planPriceByName[planName])}/user/mo</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">Number of users</p>
                  <p className="mt-1 text-sm text-white/55">Seats are billed per person, not per device.</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={seats}
                  onChange={(event) => setSeats(Math.max(1, Number(event.target.value) || 1))}
                  className="h-14 w-24 rounded-xl border border-white/[0.08] bg-dark-base text-center text-2xl font-display text-white outline-none transition focus:border-seed-500/40"
                />
              </div>
              <input
                type="range"
                min={1}
                max={150}
                value={seats}
                onChange={(event) => setSeats(Number(event.target.value))}
                className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-dark-base accent-seed-500"
              />
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">MDM devices</p>
                      <p className="mt-1 text-sm text-white/55">{formatCurrency(mdmAddon.pricePerDevice)}/device/mo</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={mdmDevices}
                      onChange={(event) => setMdmDevices(Math.max(0, Number(event.target.value) || 0))}
                      className="h-12 w-20 rounded-xl border border-white/[0.08] bg-dark-base text-center text-xl font-display text-white outline-none transition focus:border-seed-500/40"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <Wifi className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">5G failover locations</p>
                      <p className="mt-1 text-sm text-white/55">{formatCurrency(FAILOVER_PRICE_PER_LOCATION)}/location/mo</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={failoverLocations}
                      onChange={(event) => setFailoverLocations(Math.max(0, Number(event.target.value) || 0))}
                      className="h-12 w-20 rounded-xl border border-white/[0.08] bg-dark-base text-center text-xl font-display text-white outline-none transition focus:border-seed-500/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-dark-base p-6">
          <StatCard label="Commissionable monthly revenue" value={formatCurrency(clientMonthly)} accent />

          <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Payout summary</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CompactMetric label="Annual recurring revenue" value={formatCurrency(clientAnnualized)} />
              <CompactMetric label="Current commission rate" value={`${commissionRate}%`} />
              <CompactMetric label="Expected monthly commission" value={formatCurrency(monthlyPayout)} />
              <CompactMetric label="Potential 12-month commission" value={formatCurrency(yearlyPayout)} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Current commission ladder</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
              {COMMISSION_LADDER.map((tier) => (
                <div key={`${tier.minSeats}-${tier.maxSeats ?? "plus"}`} className="rounded-xl border border-white/[0.06] bg-dark-base px-3 py-2.5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-white/45">
                    {tier.maxSeats === null
                      ? `${tier.minSeats}+ seats`
                      : `${tier.minSeats}-${tier.maxSeats} seats`}
                  </span>
                  <span className="mt-1 block font-medium text-seed-300">{tier.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-dark-overlay p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Deal snapshot</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-white/70">
              <div className="rounded-xl border border-white/[0.06] bg-dark-base px-4 py-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">Plan</dt>
                <dd className="mt-1 text-white/75">{selectedPlan}</dd>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-dark-base px-4 py-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">Seats</dt>
                <dd className="mt-1 text-white/75">{seats}</dd>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-dark-base px-4 py-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">MDM devices</dt>
                <dd className="mt-1 text-white/75">{mdmDevices}</dd>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-dark-base px-4 py-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">5G failover locations</dt>
                <dd className="mt-1 text-white/75">{failoverLocations}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl border border-seed-500/20 bg-seed-500/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-seed-300">Commission note</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
                <li>Seat count sets the rate. Approved recurring add-ons change dollars, not the percentage.</li>
                <li>Paid on collected monthly recurring revenue only, for up to 12 months, on approved active accounts.</li>
                <li>Hardware, taxes, one-time fees, project labor, and unpaid invoices do not count.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}