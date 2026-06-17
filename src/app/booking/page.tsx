import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { GradientOrb, GridPattern } from "@/components/kit";
import { BookingGrid } from "@/components/booking/BookingGrid";
import { bookingGroups } from "./booking-options";

const BOOKING_URL = "https://booking.seedtechllc.com";

export const metadata: Metadata = {
  title: "Book an Appointment with SeedTech",
  description:
    "Choose the appointment type that fits your needs — discovery calls, on-site or remote support, hardware installs, and account reviews — and schedule instantly.",
  alternates: { canonical: BOOKING_URL },
  openGraph: {
    type: "website",
    url: BOOKING_URL,
    title: "Book an Appointment with SeedTech",
    description:
      "Pick a meeting type and schedule instantly with the SeedTech team.",
  },
  // Utility scheduling page — keep it out of the index, allow link-following.
  robots: { index: false, follow: true },
};

export default function BookingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-base text-white">
      {/* ── Ambient background ── */}
      <GradientOrb
        color="seed"
        size="xl"
        className="-top-40 left-1/2 -translate-x-1/2 opacity-30"
      />
      <GradientOrb
        color="blue"
        size="lg"
        className="bottom-0 -right-32 opacity-20"
      />
      <GridPattern />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* ── Header ── */}
        <header className="flex items-center justify-between py-6">
          <a
            href="https://seedtechllc.com"
            className="flex items-center"
            aria-label="SeedTech home"
          >
            <Image
              src="/seedtechlogo_white-scaled.webp"
              alt="SeedTech"
              width={160}
              height={48}
              className="h-6 w-auto object-contain"
              priority
            />
          </a>
          <a
            href="https://seedtechllc.com"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </a>
        </header>

        {/* ── Hero ── */}
        <section className="pt-12 pb-16 text-center md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-eyebrow uppercase tracking-widest text-seed-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Scheduling
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-title leading-[1.05]">
            Book time with{" "}
            <span className="text-gradient-brand">SeedTech</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-white/55">
            Choose the type of appointment that fits your needs and pick a time
            that works for you. You&apos;ll be taken straight to our calendar to
            confirm.
          </p>
        </section>

        {/* ── Booking options ── */}
        <BookingGrid groups={bookingGroups} />

        {/* ── Help / fallback ── */}
        <section className="mt-20 rounded-2xl border border-white/[0.07] bg-dark-elevated p-8 text-center">
          <h2 className="font-display text-subheading text-white">
            Not sure which to choose?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body-sm text-white/50">
            Reach out and we&apos;ll point you to the right appointment — or just
            book a discovery meeting and we&apos;ll take it from there.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="tel:+12016209002"
              className="font-medium text-white/80 transition-colors hover:text-white"
            >
              (201) 620-9002
            </a>
            <span className="hidden text-white/20 sm:inline">•</span>
            <a
              href="mailto:support@seedtechllc.com"
              className="font-medium text-white/80 transition-colors hover:text-white"
            >
              support@seedtechllc.com
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] py-8 text-center text-body-sm text-white/35">
          © {new Date().getFullYear()} SeedTech LLC ·{" "}
          <a
            href="https://seedtechllc.com"
            className="transition-colors hover:text-white/60"
          >
            seedtechllc.com
          </a>
        </footer>
      </div>
    </div>
  );
}
