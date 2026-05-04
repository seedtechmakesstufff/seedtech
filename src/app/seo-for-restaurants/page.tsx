import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PhoneCall,
  Utensils,
  Star,
  MapPin,
  Bot,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Globe,
  Brain,
  Eye,
  Smartphone,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  LiquidGlassButton,
  IconBox,
  CardTitle,
  Body,
  AnimatedH1,
  AnimatedH2,
  FAQAccordion,
} from "@/components/kit";
import type { FAQItem } from "@/components/kit";
import { AutopilotCards } from "@/components/home/AutopilotCards";
import { ValuePropsSlider } from "./ValuePropsSlider";

export const metadata: Metadata = {
  title:
    "Restaurant SEO Services | More Reservations, More Walk-Ins — SeedTech",
  description:
    "Drive more reservations and walk-ins with restaurant SEO that ranks you in Google Maps, local searches, and AI recommendations like ChatGPT and Google AI Overviews. Plans from $1,200/mo. Limited-time free website rebuild included.",
  alternates: { canonical: "/seo-for-restaurants" },
  openGraph: {
    title: "Restaurant SEO Services — Drive More Reservations | SeedTech",
    description:
      "AI-first SEO for restaurants. Rank in Google Maps, local search, and AI recommendations. Limited-time: free website rebuild with any SEO plan.",
    images: [
      {
        url: "/og-image-placeholder.png",
        width: 1200,
        height: 630,
        alt: "SEO Services for Restaurants — SeedTech",
      },
    ],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

// Shared glass card style — matches seo-autopilot + seedtech-platform pages
const glassStyle: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.10)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const problems = [
  {
    icon: Eye,
    title: "Diners search, but they don't find you",
    body: "When someone within 5 miles searches \"best dinner spot near me\" or \"steakhouse with a private room,\" if you're not on the first page, you don't exist. Most restaurant websites are invisible in the only places that matter.",
  },
  {
    icon: Bot,
    title: "AI is the new word-of-mouth",
    body: "ChatGPT, Google AI Overviews, and Gemini are now answering \"where should I eat tonight?\" before users ever click a result. If your restaurant isn't being cited by AI, you're losing reservations to the ones that are.",
  },
  {
    icon: Smartphone,
    title: "Your Google Business Profile is leaking leads",
    body: "Most restaurants set up Google Business once and never touch it again. Photos go stale, hours fall out of sync, posts go silent — and Google quietly demotes you in Maps results.",
  },
];

const valueProps = [
  {
    icon: <TrendingUp />,
    title: "More reservations from search",
    body: "Rank for the high-intent searches that actually fill tables — \"date night restaurants near me,\" \"best [cuisine] in [city],\" \"private dining for 20 guests.\" Local SEO is the channel with the lowest customer acquisition cost in hospitality.",
  },
  {
    icon: <MapPin />,
    title: "Dominate Google Maps in your radius",
    body: "Map Pack rankings drive 3x more clicks than organic results for restaurant searches. We optimize your Google Business Profile, manage reviews, and build the local citations and content that move you into the top 3 pins.",
  },
  {
    icon: <Brain />,
    title: "Cited by ChatGPT, Gemini, and AI Overviews",
    body: "When AI assistants recommend restaurants, they pull from structured, citable content. We build pages that are explicitly designed to be quoted by AI — turning your menu, story, and reviews into AI-discoverable answers.",
  },
  {
    icon: <Star />,
    title: "More 5-star reviews, less effort",
    body: "Reviews are the #1 ranking factor for local restaurant SEO. We build automated review request flows, reply templates, and reputation tracking so your star count grows without you thinking about it.",
  },
  {
    icon: <Users />,
    title: "Capture diners researching you",
    body: "Most reservations start with \"is [restaurant] any good?\" We help you control that narrative — menu pages, dietary info pages, FAQ schema, and review showcases that convert researchers into bookings.",
  },
  {
    icon: <Calendar />,
    title: "Fill tables on slow nights",
    body: "Strategic content for Tuesday lunch, Wednesday happy hour, off-peak weekend brunches — targeting the searches that bring diners in when you need them most.",
  },
];

const plans = [
  {
    name: "Local Authority",
    price: "$1,200",
    period: "/month",
    tagline: "For restaurants ready to own local search",
    features: [
      "SEO Autopilot platform — full access",
      "Google Business Profile optimization & weekly posts",
      "20 tracked keywords (local + AI search)",
      "2 published blog posts per month",
      "Monthly review monitoring & reply templates",
      "Local citation building (10 citations/quarter)",
      "Monthly performance reports",
    ],
    highlight: false,
    cta: "Start Local Authority",
  },
  {
    name: "Market Dominator",
    price: "$2,500",
    period: "/month",
    tagline: "For restaurants competing in tough markets",
    features: [
      "Everything in Local Authority, plus:",
      "60 tracked keywords (multi-location ready)",
      "4 published blog posts per month",
      "AI citation tracking (ChatGPT, Gemini, AI Overviews)",
      "Competitor SERP analysis & gap monitoring",
      "Reputation management — automated review request flows",
      "Local link building (5 quality links/month)",
      "Priority support + dedicated account lead",
    ],
    highlight: true,
    cta: "Start Market Dominator",
  },
];

const process = [
  {
    step: "01",
    title: "Free SEO & visibility audit",
    body: "We audit your current rankings, Google Business Profile, AI visibility scores, on-page SEO, and competitor positioning — and show you exactly where the opportunity is.",
  },
  {
    step: "02",
    title: "Free website rebuild (limited time)",
    body: "Sign up for any SEO plan during the launch window and we rebuild your restaurant website on the SeedTech Platform — with SEO, performance, and AI-readiness baked in. Normally $7,800.",
  },
  {
    step: "03",
    title: "Strategy & keyword mapping",
    body: "We map keywords to pages, identify content gaps, plan your local content calendar, and configure SEO Autopilot with your menus, locations, and target audience.",
  },
  {
    step: "04",
    title: "Execute every month",
    body: "Content gets published. GBP gets optimized. Reviews get requested. Citations get built. Every month, we show you exactly what moved.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Do restaurants really need SEO?",
    answer:
      "Yes — and it's arguably the highest-ROI marketing channel for restaurants. 76% of people who search for something nearby on their phone visit a business within 24 hours, and 28% of those searches result in a purchase. If you're not ranking for \"restaurants near me\" or category-specific searches in your area, you're handing customers to competitors every single day.",
  },
  {
    question: "What is the free website rebuild?",
    answer:
      "For a limited time, when you sign up for either of our SEO plans, we rebuild your restaurant website on the SeedTech Platform at no cost. This is normally $7,800 and includes a custom restaurant website with menu, reservations integration, online ordering hooks, mobile-first design, structured data for AI search, and SEO Autopilot pre-configured. The offer is included with any active SEO plan during our launch window.",
  },
  {
    question: "How long until I see results from restaurant SEO?",
    answer:
      "Local SEO results typically appear within 30–60 days for low-competition keywords (your branded terms, niche cuisines, neighborhood searches) and 90–180 days for competitive head terms (\"best restaurant in [city]\"). Google Maps rankings often move within the first 30 days of optimization. AI citation results are emerging faster — we've seen restaurants picked up by ChatGPT and Gemini within 6 weeks of structured content publishing.",
  },
  {
    question: "What is SEO Autopilot?",
    answer:
      "SEO Autopilot is our proprietary SEO platform that lives inside your website's admin panel. It connects directly to Google Search Console, runs 25+ automated audits, scores your AI visibility across 5 platforms (ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot), tracks keywords, monitors competitors, and generates on-brand content. You get a transparent, real-time view of what's working — not a monthly PDF from an agency.",
  },
  {
    question: "Why does AI search matter for restaurants?",
    answer:
      "When someone asks ChatGPT or Google's AI Overview \"what's a good Italian restaurant in [city]?\", the AI scans the web for citable, structured content and recommends specific businesses. Restaurants that show up in those answers capture demand before traditional search results even load. Our SEO platform is one of the only systems explicitly designed to optimize for AI citation, not just blue-link rankings.",
  },
  {
    question: "Can I keep my existing reservation system or POS?",
    answer:
      "Yes. We integrate with OpenTable, Resy, Tock, Yelp Reservations, Toast, Square, and most modern restaurant platforms. The free website rebuild preserves all your existing integrations — we just give them a faster, better-ranking home.",
  },
  {
    question: "Do you handle multi-location restaurants?",
    answer:
      "Yes — the Market Dominator plan is built for multi-location restaurant groups. We build location-specific landing pages, manage multiple Google Business Profiles, and track per-location keyword performance separately. We also build a unified content strategy that lifts the brand across all locations.",
  },
  {
    question: "What if I already have an SEO agency?",
    answer:
      "We're happy to do a side-by-side audit and show you exactly what they're delivering versus what we'd deliver. Our pricing is competitive with most boutique SEO agencies, but you also get the SEO Autopilot platform (a $400+/month value) and a free website rebuild — neither of which traditional agencies can offer.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No long-term contracts. Our SEO plans are month-to-month — you can cancel anytime. That said, restaurant SEO genuinely takes 4–6 months to compound, so anyone who promises results in 30 days is selling you something we don't sell.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Restaurant SEO Services",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "95 Main Street",
      addressLocality: "Hopatcong",
      addressRegion: "NJ",
      postalCode: "07843",
      addressCountry: "US",
    },
  },
  serviceType: "Search Engine Optimization for Restaurants",
  areaServed: { "@type": "Country", name: "United States" },
  description:
    "Local SEO and AI search optimization for restaurants. Drive more reservations and walk-ins by ranking in Google Maps, local search, and AI recommendations like ChatGPT and Google AI Overviews.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "1200",
    highPrice: "2500",
    priceCurrency: "USD",
    offerCount: "2",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Restaurant SEO",
      item: "https://seedtechllc.com/seo-for-restaurants",
    },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function RestaurantSeoPage() {
  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="seed" size="xl" className="-top-40 right-0 opacity-20" />
        <GradientOrb color="blue" size="lg" className="bottom-10 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <LiquidGlassPill variant="seed" className="mb-6">
                <Utensils className="w-3.5 h-3.5 mr-1.5" /> Restaurant SEO
              </LiquidGlassPill>
              <AnimatedH1 className="mb-6 leading-[1.05]">
                Fill more tables. Rank where your guests are searching.
              </AnimatedH1>
              <p className="mb-6 text-body-lg leading-relaxed text-light-base/60">
                Local SEO is the lowest-cost lead channel in hospitality — and most restaurants
                are invisible in it. We build the rankings, reviews, and AI-cited content that
                turn search traffic into reservations.
              </p>
              <p className="mb-10 text-body-lg leading-relaxed text-light-base/60">
                Sign up during our launch window and{" "}
                <span className="text-amber-300 font-medium">
                  we rebuild your website for free
                </span>{" "}
                — mobile-first, AI-ready, fully integrated with your reservation system. Normally $7,800.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/contact?service=seo-restaurant"
                  className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
                >
                  Claim Your Free Rebuild <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+19143628889"
                  className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
                >
                  <PhoneCall className="h-4 w-4" /> (914) 362-8889
                </a>
              </div>
              {/* Trust strip */}
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-seed-400" />
                  <span>5 AI platforms tracked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-seed-400" />
                  <span>Live Search Console data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-seed-400" />
                  <span>Month-to-month, no contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-seed-400" />
                  <span>OpenTable / Resy / Toast integrations</span>
                </div>
              </div>
            </div>
            {/* Hero visual placeholder */}
            <div className="hidden lg:block relative">
              <div className="relative aspect-[4/5] rounded-3xl border border-white/10 bg-gradient-to-br from-seed-500/20 via-emerald-500/10 to-blue-500/20 backdrop-blur-sm overflow-hidden">
                <GridPattern />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Utensils className="h-10 w-10 text-seed-300" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                    Restaurant Hero Image
                  </p>
                  <p className="text-sm text-white/50 max-w-xs">
                    Replace with hero shot of food, dining room, or owner / chef portrait
                  </p>
                </div>
                {/* Resolution spec badge */}
                <div className="absolute bottom-3 right-3 rounded-md bg-black/40 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-white/40 border border-white/10">
                  placeholder · 1200×1500 (4:5)
                </div>
                {/* Floating stat cards */}
                <div className="absolute top-6 right-6 rounded-xl border border-white/15 bg-dark-base/70 px-4 py-2.5 backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-seed-400">Map Pack</p>
                  <p className="font-display text-base font-bold text-white">#1 → #1</p>
                </div>
                <div className="absolute bottom-6 left-6 rounded-xl border border-white/15 bg-dark-base/70 px-4 py-2.5 backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-seed-400">Reservations</p>
                  <p className="font-display text-base font-bold text-white">+47% MoM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stat strip ═══ */}
      <Section theme="light">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="The Numbers"
            title="Restaurant search is where the demand lives"
            description="Every percentage point of local search visibility maps directly to reservations. Here's what the data actually says."
            theme="light"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                stat: "76%",
                label: "of local mobile searchers visit a business within 24 hours",
              },
              { stat: "3x", label: "more clicks for businesses ranking in the Google Map Pack" },
              { stat: "88%", label: "of consumers trust online reviews as much as personal recommendations" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight"
              >
                <p className="font-display text-heading-lg text-seed-600 mb-2">{s.stat}</p>
                <p className="text-body-sm leading-relaxed text-dark-base/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ The Problem ═══ */}
      <Section>
        <SectionHeader
          eyebrow="What's Broken"
          title="Why most restaurant websites quietly fail at SEO"
          description="It's not that restaurants don't care about getting found online. It's that the playbook for restaurant SEO has changed three times in the last two years — and most websites are still running the 2019 version."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <LiquidGlassCard key={p.title} className="p-7">
              <IconBox icon={p.icon} variant="gradient" className="mb-4" />
              <CardTitle className="mb-2">{p.title}</CardTitle>
              <Body className="text-light-base/55 leading-relaxed">{p.body}</Body>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ Value Props (Lead Drivers) ═══ */}
      <section className="bg-dark-base py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              What You Get
            </p>
            <AnimatedH2
              highlightWords={["reservations,"]}
              className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-5"
            >
              Restaurant SEO that drives reservations, not just rankings.
            </AnimatedH2>
            <p className="text-sm md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
              Rankings only matter if they fill tables. Every part of our service is engineered
              around the same metric: more diners walking through the door.
            </p>
          </div>

          {/* Full-bleed image cards — Squarespace-style slider, mobile-first */}
          <ValuePropsSlider items={valueProps} />
        </div>
      </section>

      {/* ═══ AI Search Spotlight ═══ */}
      <Section>
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-seed-600/10 via-emerald-600/5 to-blue-600/10 p-10 md:p-16 backdrop-blur-sm">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-seed-400">
              <Bot className="w-3.5 h-3.5" />
              AI Search Optimization
            </div>
            <AnimatedH2 className="mb-6 max-w-3xl">
              When AI recommends restaurants, you want to be the answer.
            </AnimatedH2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4 text-body-lg leading-relaxed text-light-base/60">
                <p>
                  ChatGPT, Google AI Overviews, Gemini, and Perplexity are now answering
                  &quot;where should we eat?&quot; before any blue link loads. Restaurants that
                  get cited capture demand the rest of the market never sees.
                </p>
                <p>
                  We&apos;re one of the only platforms that explicitly tracks and optimizes for
                  AI citation — restructuring your menu, story, and reviews into the kind of
                  content these systems pull from.
                </p>
                {/* Visual placeholder — AI citation example */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-dark-base/50 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-seed-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      ChatGPT response (example)
                    </span>
                  </div>
                  <p className="text-sm text-white/70 italic leading-relaxed">
                    &quot;For an upscale dinner near you, [Your Restaurant] is highly rated for
                    its [cuisine] menu and seasonal tasting options...&quot;
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-seed-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Cited from your menu page + reviews</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "AI Visibility scores on every page (0–100)",
                  "Live citation tracking across 5 AI platforms",
                  "Structured data for menu, hours, dietary info, and FAQs",
                  "Citeable opening paragraphs on every page",
                  "Entity authority — make AI confident your brand exists",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-seed-400 flex-shrink-0 mt-0.5" />
                    <span className="text-body-sm text-light-base/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ SEO Autopilot Platform ═══ */}
      <section className="bg-dark-raised py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-seed-400 mb-4">
              The Platform
            </p>
            <AnimatedH2
              highlightWords={["Autopilot"]}
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
            >
              SEO Autopilot Comes Built In
            </AnimatedH2>
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
              Every plan includes full access to our proprietary SEO platform. No third-party
              dashboards. No monthly PDF reports. Real data, in real time, in your admin panel.
            </p>
          </div>

          <AutopilotCards />

          <div className="text-center">
            <Link
              href="/services/seo-autopilot"
              className="inline-flex items-center gap-2 text-sm font-medium text-seed-400 hover:text-seed-300 transition-colors"
            >
              Learn more about SEO Autopilot <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Process ═══ */}
      <Section>
        <SectionHeader
          eyebrow="How It Works"
          title="Four steps from invisible to fully booked"
          description="No long-winded onboarding. No mysterious black-box agency work. Here's exactly what happens after you sign up."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {process.map((p) => (
            <LiquidGlassCard key={p.step} className="p-7">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 font-display text-heading-lg text-seed-400/50 leading-none">
                  {p.step}
                </div>
                <div>
                  <CardTitle className="mb-2">{p.title}</CardTitle>
                  <Body className="text-light-base/55 leading-relaxed">{p.body}</Body>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* ═══ Pricing ═══ */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Pricing"
          title="Two plans. Both come with a free website rebuild."
          description="Pick the plan that matches your market — single location vs. competitive multi-location. Sign up during our launch window and your full website rebuild is included at no charge."
          theme="light"
        />
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 md:p-10 ${
                plan.highlight
                  ? "border-2 border-seed-500 bg-gradient-to-br from-seed-50 to-white shadow-xl"
                  : "border border-black/[0.06] bg-white shadow-cardLight"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-seed-500 to-emerald-500 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-heading text-dark-base mb-2">{plan.name}</h3>
              <p className="text-body-sm text-dark-base/60 mb-6">{plan.tagline}</p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="font-display text-heading-lg text-dark-base">{plan.price}</span>
                <span className="text-body-sm text-dark-base/50">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? "text-seed-600" : "text-seed-500"
                      }`}
                    />
                    <span className="text-body-sm text-dark-base/75 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?service=seo-restaurant&plan=${encodeURIComponent(plan.name)}`}
                className={`flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-seed-500 to-emerald-500 text-white hover:shadow-glowSeed"
                    : "border border-dark-base/10 text-dark-base hover:border-seed-500 hover:text-seed-600"
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Free Website Rebuild — dedicated section ═══ */}
      <section
        id="free-rebuild"
        className="relative overflow-hidden bg-dark-base py-24 md:py-32 scroll-mt-24"
      >
        <GradientOrb color="seed" size="xl" className="-top-20 left-1/2 -translate-x-1/2 opacity-20" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Limited Time Offer
          </div>
          <AnimatedH2
            highlightWords={["Free", "Rebuild"]}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6"
          >
            Get a Free Website Rebuild with Any SEO Plan
          </AnimatedH2>
          <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            Sign up for either plan during our launch window and we rebuild your restaurant
            website on the SeedTech Platform at no cost.{" "}
            <span className="text-amber-300 font-medium">Normally $7,800.</span>
          </p>

          {/* Image placeholder */}
          <div className="mx-auto max-w-3xl mb-12">
            <div className="relative aspect-[16/9] rounded-3xl border border-white/10 bg-gradient-to-br from-seed-500/15 via-emerald-500/5 to-blue-500/15 backdrop-blur-sm overflow-hidden">
              <GridPattern />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Globe className="h-8 w-8 text-seed-300" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
                  Website Mockup Placeholder
                </p>
                <p className="text-sm text-white/50 max-w-sm">
                  Replace with screenshot of a restaurant site built on the SeedTech Platform
                </p>
              </div>
              {/* Resolution spec badge */}
              <div className="absolute bottom-3 right-3 rounded-md bg-black/40 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-white/40 border border-white/10">
                placeholder · 1920×1080 (16:9)
              </div>
            </div>
          </div>

          {/* Platform / Next.js explainer */}
          <div className="text-left max-w-3xl mx-auto space-y-5 mb-10">
            <h3 className="font-display text-xl md:text-2xl font-bold text-white text-center mb-2">
              Built on Next.js. Fully Custom-Coded. Insanely Fast.
            </h3>
            <p className="text-sm md:text-[15px] text-white/55 leading-relaxed">
              Most restaurant websites are bloated WordPress installs or drag-and-drop templates
              loaded with 30+ third-party scripts. They&apos;re slow, fragile, and Google ranks
              them accordingly. The SeedTech Platform is different — every site is a fully
              custom-coded application built on{" "}
              <span className="text-white font-medium">Next.js</span>, the same React framework
              powering Nike, TikTok, and OpenAI.
            </p>
            <p className="text-sm md:text-[15px] text-white/55 leading-relaxed">
              That means your site loads in under a second, ships with perfect Core Web Vitals,
              renders content server-side for AI crawlers, and has structured data baked into
              every page from day one. No plugins. No bloat. No security patches to chase.
              Just the fastest, most SEO-optimized foundation a restaurant website can have.
            </p>
          </div>

          {/* Feature bullets — match site card design */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10 text-left">
            {[
              { label: "Sub-second load times", note: "Server-side rendered, edge-cached, image-optimized." },
              { label: "Perfect Core Web Vitals", note: "Google's ranking signals — green across the board." },
              { label: "Mobile-first design", note: "70% of restaurant searches happen on phones." },
              { label: "Reservation & POS integrations", note: "OpenTable, Resy, Tock, Toast, Square — all wired in." },
              { label: "AI-ready structured data", note: "Menu, hours, dietary info — all marked up for AI citation." },
              { label: "SEO Autopilot pre-configured", note: "Platform live and tracking from day one." },
            ].map((item) => (
              <div key={item.label} style={glassStyle} className="p-5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-seed-400 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <LiquidGlassButton
            href="/contact?service=seo-restaurant&plan=free-rebuild"
            variant="seed"
            size="lg"
          >
            Contact Sam for more details
          </LiquidGlassButton>
          <p className="text-xs text-white/30 mt-4">
            Offer ends when our launch cohort closes.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <Section>
        <SectionHeader title="Restaurant SEO — Frequently Asked Questions" />
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      {/* ═══ Pinned Floating "Limited Time" CTA ═══ */}
      <a
        href="#free-rebuild"
        className="group fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-dark-base/90 backdrop-blur-md px-5 py-4 shadow-2xl shadow-amber-500/10 hover:border-amber-400/70 hover:bg-dark-base hover:shadow-amber-500/20 transition-all duration-300 max-w-[280px]"
        aria-label="Free website rebuild — limited time offer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 border border-amber-400/30 shrink-0">
          <Sparkles className="h-5 w-5 text-amber-300" />
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
            Limited Time
          </p>
          <p className="text-sm font-semibold text-white leading-tight">
            Free Website Rebuild
          </p>
          <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors flex items-center gap-1">
            Learn more <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </a>
    </div>
  );
}
