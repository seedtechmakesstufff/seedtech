import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Mail,
  MailX,
  PhoneCall,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Settings,
  Server,
  Globe,
  Lock,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import {
  GradientOrb,
  GridPattern,
  LiquidGlassCard,
  LiquidGlassPill,
  CTABanner,
  AnimatedH1,
} from "@/components/kit";

/* ─── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Business Email Down? Fix Email Outages Fast | SeedTech",
  description:
    "Company email down? Diagnose email problems, restore connectivity, and prevent future outages. SeedTech resolves business email issues fast. Call (914) 362-8889.",
  alternates: { canonical: "/business-email-down" },
  openGraph: {
    title: "Business Email Down? — SeedTech",
    description:
      "Your company email is down and no one can send or receive messages. Here's how to diagnose the problem and get expert help restoring email service.",
    images: [{ url: "/og-image-placeholder.png", width: 1200, height: 630, alt: "Business Email Down — SeedTech" }],
  },
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const emailDownSigns = [
  {
    icon: MailX,
    title: "No one can send or receive email",
    body: "Every employee is affected. Outlook shows disconnected, webmail won't load, and messages are bouncing. Customers and vendors are getting silence.",
  },
  {
    icon: Clock,
    title: "Emails are delayed by hours",
    body: "Messages are eventually arriving, but with 2-6 hour delays. Clients think you're ignoring them, time-sensitive deals are slipping, and you can't communicate reliably.",
  },
  {
    icon: AlertTriangle,
    title: "Some accounts work, others don't",
    body: "Half the company can send email, the other half can't. There's no obvious pattern — it looks like random accounts are affected.",
  },
  {
    icon: ShieldAlert,
    title: "Emails are going to spam or being blocked",
    body: "Your domain may be blacklisted. Outbound messages are being rejected by recipients' servers, or every inbound email is landing in junk folders.",
  },
  {
    icon: Lock,
    title: "Accounts are locked or compromised",
    body: "Password resets aren't working, MFA is failing, or you suspect an account has been hacked. Someone may have gained unauthorized access to your email environment.",
  },
  {
    icon: Globe,
    title: "Email works on phones but not desktops (or vice versa)",
    body: "Some platforms can connect, others can't. This usually points to a configuration issue, certificate problem, or selective outage from your email provider.",
  },
];

const diagnosticSteps = [
  { step: "01", title: "Determine the scope", body: "Is it one person, one department, or the entire company? Check whether the issue affects Outlook, webmail, and mobile — or just one platform. This narrows the cause significantly." },
  { step: "02", title: "Check your email provider's status", body: "If you use Microsoft 365 or Google Workspace, check their service status pages. Provider-side outages are more common than most businesses realize — and there's nothing to do but wait." },
  { step: "03", title: "Verify DNS and MX records", body: "If someone recently changed your domain registrar, hosting, or DNS provider, your MX records may be misconfigured. Incorrect mail routing is one of the most common causes of company-wide email failure." },
  { step: "04", title: "Check for a security incident", body: "If accounts are locked, passwords were changed without authorization, or you're seeing emails you didn't send — this may be a compromised account situation. Change all passwords immediately and call for help." },
  { step: "05", title: "Don't make changes if you're not sure", body: "Editing DNS records, changing mail server settings, or modifying firewall rules without understanding the impact can make the outage worse. If you're uncertain, stop and call a professional." },
  { step: "06", title: "Call SeedTech for immediate help", body: "Business email outages are urgent. Call (914) 362-8889 — we diagnose email infrastructure issues remotely and can usually identify the cause within minutes." },
];

const commonCauses = [
  { icon: Server, title: "Microsoft 365 or Google outage", body: "Cloud email providers have outages more often than you'd expect. When they do, there's little you can do except wait — but verifying it's them (not you) saves hours of unnecessary troubleshooting." },
  { icon: Settings, title: "DNS or MX record misconfiguration", body: "Someone changed your domain hosting, transferred registrars, or updated DNS without preserving your MX records. Email routing breaks silently — everything looks normal until messages stop flowing." },
  { icon: ShieldAlert, title: "Domain blacklisting", body: "If a compromised account on your domain sent spam, your domain may have been blacklisted by major email providers. All outbound email gets rejected, and inbound senders see bounce messages." },
  { icon: Lock, title: "Compromised account", body: "An attacker gained access to one or more email accounts — changed passwords, set up forwarding rules, or used the account to send phishing emails. This requires immediate containment and investigation." },
  { icon: Mail, title: "Mailbox storage limits", body: "Full mailboxes can't receive new messages. If multiple employees hit their storage quota at the same time, it can look like a system-wide outage. This is especially common on lower-tier Microsoft 365 plans." },
  { icon: AlertTriangle, title: "Certificate or authentication failure", body: "Expired SSL certificates, Autodiscover misconfigurations, or broken OAuth tokens can prevent email clients from connecting — even though the mail server itself is running fine." },
];

const faqs = [
  {
    q: "Why is my business email down?",
    a: "The most common causes are cloud provider outages (Microsoft 365, Google Workspace), DNS/MX record misconfigurations, domain blacklisting from a compromised account, expired certificates, and mailbox storage limits. The cause determines the fix — which is why proper diagnosis matters before making changes.",
  },
  {
    q: "How do I check if Microsoft 365 is down?",
    a: "Visit the Microsoft 365 Service Health page (admin.microsoft.com → Health → Service health) or check third-party status trackers like DownDetector. If Microsoft confirms an outage, the only option is to wait for their resolution — but at least you know it's not your problem to fix.",
  },
  {
    q: "Our email is sending but not receiving — what's wrong?",
    a: "This almost always points to a DNS or MX record issue. Your MX records tell the internet where to deliver mail for your domain. If they're missing, incorrect, or pointing to the wrong server, inbound mail has nowhere to go. Check your MX records at MXToolbox.com.",
  },
  {
    q: "Can a hacked email account take down the whole company's email?",
    a: "Yes. If a compromised account sends enough spam, your entire domain can be blacklisted by major email providers (Gmail, Outlook.com, Yahoo). Once blacklisted, all email from your domain gets rejected — not just the compromised account. Containment and delisting is urgent.",
  },
  {
    q: "How long does it take to fix a business email outage?",
    a: "Provider outages resolve on the provider's timeline (usually 1-4 hours). DNS issues can be fixed in minutes but take up to 48 hours to propagate. Blacklisting removal takes 24-72 hours. Compromised account remediation is usually same-day. SeedTech begins diagnosis within minutes of your call.",
  },
  {
    q: "How do I prevent business email outages?",
    a: "Enable MFA on all accounts to prevent compromise. Monitor your domain's blacklist status regularly. Use enterprise email plans with adequate storage. Maintain proper DNS records. And have a managed IT provider watching your email infrastructure — SeedCare plans include email health monitoring and security alerts.",
  },
];

/* ─── JSON-LD ──────────────────────────────────────────────────────────────── */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Business Email Down — Emergency Support",
  provider: {
    "@type": "LocalBusiness",
    name: "SeedTech",
    url: "https://seedtechllc.com",
    telephone: "+19143628889",
    email: "support@seedtechllc.com",
    address: { "@type": "PostalAddress", addressLocality: "Hopatcong", addressRegion: "NJ", addressCountry: "US" },
  },
  serviceType: "Email Support",
  areaServed: [
    { "@type": "State", name: "New Jersey" },
    { "@type": "City", name: "New York City" },
  ],
  description:
    "Emergency support for business email outages — Microsoft 365, Google Workspace, and on-premise mail server issues. Diagnosis, restoration, and prevention.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seedtechllc.com" },
    { "@type": "ListItem", position: 2, name: "Business Email Down", item: "https://seedtechllc.com/business-email-down" },
  ],
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function BusinessEmailDownPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumbs */}
      <div className="bg-dark-base pt-4 pb-0">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-light-base/30 flex items-center gap-1.5">
            <Link href="/" className="hover:text-light-base/50 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-light-base/60">Business Email Down</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
        <GradientOrb color="blue" size="xl" className="-top-40 right-0 opacity-25" />
        <GradientOrb color="seed" size="lg" className="bottom-0 -left-20 opacity-15" />
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <LiquidGlassPill variant="blue" className="mb-6">
            <MailX className="w-3.5 h-3.5 mr-1.5" />
            Email Emergency
          </LiquidGlassPill>
          <AnimatedH1 className="mb-6 max-w-4xl">
            Business Email Down? Fix It Before You Lose Customers.
          </AnimatedH1>
          <div className="mb-10 max-w-3xl space-y-4 text-body-lg leading-relaxed text-light-base/60">
            <p>
              Your company email is down. No one can send or receive messages. Customers
              think you&apos;re ignoring them, deals are stalling, and your team has no
              way to communicate externally. Every hour without email costs you business.
            </p>
            <p>
              SeedTech diagnoses email outages fast — whether it&apos;s a Microsoft 365
              issue, DNS misconfiguration, or a compromised account. We identify the
              cause and restore service, usually within hours.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+19143628889"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass-tinted-seed liquid-glass-hover px-8 py-3.5 text-sm font-medium text-white transition-all duration-300"
            >
              <PhoneCall className="h-4 w-4" />
              Call Now: (914) 362-8889
            </a>
            <Link
              href="/emergency-it-support-new-jersey"
              className="inline-flex items-center gap-2 rounded-xl liquid-glass px-8 py-3.5 text-sm font-medium text-white transition-all duration-200"
            >
              Emergency IT Support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted by Brands */}
      <TrustedBySection />

      {/* Section 1 — What are you seeing? */}
      <Section theme="light">
        <SectionHeader
          eyebrow="What Are You Experiencing?"
          title="Signs Your Business Email Is Down"
          description="Email problems range from total outages to subtle delivery failures. Here's what each scenario looks like and what it usually means."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emailDownSigns.map((card) => (
            <div key={card.title} className="rounded-2xl border border-amber-100 bg-amber-50/30 p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <card.icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2 — Diagnostic steps (featured snippet target) */}
      <Section>
        <SectionHeader
          eyebrow="Troubleshooting Steps"
          title="How to Diagnose a Business Email Outage"
          description="Follow these steps before making changes. Editing the wrong setting can extend the outage from hours to days."
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {diagnosticSteps.map((s) => (
            <LiquidGlassCard key={s.step} className="flex gap-5 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-seed-600/20 text-seed-400 font-display font-bold text-lg">
                {s.step}
              </div>
              <div>
                <h3 className="font-display text-card-title text-white mb-1">{s.title}</h3>
                <p className="text-body-sm leading-relaxed text-light-base/55">{s.body}</p>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </Section>

      {/* Section 3 — Common causes */}
      <Section theme="light">
        <SectionHeader
          eyebrow="Root Causes"
          title="Why Business Email Goes Down"
          description="Understanding the cause is critical because the fix is completely different for each scenario."
          theme="light"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonCauses.map((card) => (
            <div key={card.title} className="rounded-2xl border border-black/[0.05] bg-white p-7 shadow-cardLight">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <card.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 font-display text-card-title text-dark-base">{card.title}</h3>
              <p className="text-body-sm leading-relaxed text-dark-base/60">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4 — Prevention */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <LiquidGlassPill variant="seed" className="mb-6 mx-auto">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Prevention
          </LiquidGlassPill>
          <h2 className="mb-6 font-display text-heading text-white md:text-heading-lg">
            Prevent Email Outages Before They Cost You Business
          </h2>
          <div className="space-y-4 text-body-lg leading-relaxed text-light-base/55">
            <p>
              Most email outages are preventable with proper security and monitoring.
              MFA on every account stops compromise. DNS monitoring catches misconfigurations.
              Blacklist monitoring alerts you before delivery problems start.
            </p>
            <p>
              SeedCare plans include email health monitoring, MFA enforcement, phishing
              protection through SentinelOne, and proactive domain security. Starting
              at <strong className="text-white">$110/user/month</strong> with no contracts.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/managed-it-services-new-jersey"
              className="inline-flex items-center gap-2 text-seed-400 hover:text-seed-300 text-sm font-medium transition-colors"
            >
              Learn about SeedCare plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="light">
        <SectionHeader title="Business Email Down — Frequently Asked Questions" align="left" theme="light" />
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-cardLight">
              <h3 className="font-display text-card-title text-dark-base mb-3">{faq.q}</h3>
              <p className="text-body-sm text-dark-base/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal links */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-card-title text-white">Related Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/server-down-business" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Server Down? →</h3>
              <p className="text-body-sm text-light-base/50">Business server outage diagnosis and support.</p>
            </Link>
            <Link href="/network-down-business" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Network Down? →</h3>
              <p className="text-body-sm text-light-base/50">Troubleshoot network connectivity problems.</p>
            </Link>
            <Link href="/company-server-down" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Company Server Down →</h3>
              <p className="text-body-sm text-light-base/50">Emergency response when your company server fails.</p>
            </Link>
            <Link href="/emergency-it-support-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Emergency IT Support NJ →</h3>
              <p className="text-body-sm text-light-base/50">Immediate emergency IT response across NJ.</p>
            </Link>
            <Link href="/cybersecurity-services-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cybersecurity Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Protect your email and systems from threats.</p>
            </Link>
            <Link href="/cloud-services-new-jersey" className="group rounded-2xl border border-white/[0.06] bg-dark-elevated/50 p-6 hover:bg-dark-elevated/80 transition-colors">
              <h3 className="font-display text-card-title text-white mb-1 group-hover:text-seed-400 transition-colors">Cloud Services NJ →</h3>
              <p className="text-body-sm text-light-base/50">Microsoft 365, cloud migration, and management.</p>
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="light">
        <CTABanner
          title="Email Down? Every Minute Without Email Costs You."
          description="SeedTech diagnoses and resolves business email outages fast — Microsoft 365, Google Workspace, DNS issues, and compromised accounts. Call now."
          primaryLabel="Call (914) 362-8889"
          primaryHref="tel:+19143628889"
          secondaryLabel="Emergency IT Support"
          secondaryHref="/emergency-it-support-new-jersey"
        />
      </Section>
    </div>
  );
}
