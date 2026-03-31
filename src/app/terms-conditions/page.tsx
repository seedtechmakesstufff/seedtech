import Link from "next/link";
import { buildMetadata } from "@/lib/page-metadata";

export const generateMetadata = buildMetadata("/terms-conditions", {
  title: "Privacy Policy & Terms",
  description:
    "SeedTech LLC's privacy policy and terms of service — how we collect, use, and protect your contact information.",
  noIndex: true,
});

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-dark-base text-white">
      <div className="mx-auto max-w-3xl px-6 py-28">
        {/* Header */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
          >
            ← Back to Home
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm">Effective date: March 13, 2026 · SeedTech LLC</p>
        </div>

        {/* Body */}
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none space-y-10 text-white/70 leading-relaxed">
          {/* Intro */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Introduction</h2>
            <p>
              Thank you for choosing SeedTech LLC. Protecting your privacy is paramount to us. This Privacy Policy
              outlines how we handle and safeguard your contact information.
            </p>
          </section>

          {/* Collection */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Collection of Information</h2>
            <p>
              We collect contact information provided by our consumers voluntarily. This may include but is not limited
              to: name, email address, phone number, and physical address.
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside marker:text-seed-500">
              <li>
                You can cancel the SMS service at any time. Just text <strong className="text-white/80">&ldquo;STOP&rdquo;</strong>{" "}
                to the short code. After you send the SMS message &ldquo;STOP&rdquo; to us, we will send you an SMS message to
                confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us.
                If you want to join again, just sign up as you did the first time and we will start sending SMS
                messages to you again.
              </li>
              <li>
                If you are experiencing issues with the messaging program, you can reply with the keyword{" "}
                <strong className="text-white/80">HELP</strong> for more assistance, or you can get help directly at{" "}
                <a href="mailto:hello@seedtechllc.com" className="text-seed-400 hover:text-seed-300 underline underline-offset-2 transition-colors">
                  hello@seedtechllc.com
                </a>.
              </li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
              <li>
                As always, message and data rates may apply for any messages sent to you from us and to us from you.
                You will receive messages about upcoming events, specials, and coupons. If you have any questions about
                your text plan or data plan, it is best to contact your wireless provider.
              </li>
              <li>
                If you have any questions regarding privacy, please read our privacy policy below.
              </li>
            </ul>
          </section>

          {/* Purpose */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Purpose of Collection</h2>
            <p>Contact information is collected for the following purposes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-seed-500">
              <li>To send updates and notifications about our services.</li>
              <li>To respond to consumer inquiries.</li>
              <li>To provide relevant promotional materials.</li>
              <li>To improve our services based on consumer feedback.</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Data Sharing &amp; Transfer</h2>
            <p>
              SeedTech LLC will <strong className="text-white/80">NOT</strong> sell, lease, or trade your contact
              information to third parties. Information is only shared when:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-seed-500">
              <li>Required by law.</li>
              <li>
                It&apos;s necessary for third-party service providers we use, such as email services, under strict
                confidentiality agreements.
              </li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Data Protection</h2>
            <p>
              We take all reasonable precautions to ensure your contact information is protected from unauthorized
              access, loss, misuse, disclosure, or alteration. This includes physical, electronic, and managerial
              procedures to safeguard the information we collect.
            </p>
          </section>

          {/* Access & Correction */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Access &amp; Correction Rights</h2>
            <p>
              Consumers have the right to access, correct, and delete their contact information stored with us.
              Reach out to our support team for assistance.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Updates</h2>
            <p>
              From time to time, we may update this Privacy Policy. Any changes will be promptly communicated on
              our website and via email notifications.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Contact Us</h2>
            <p>
              For any questions or concerns related to this Privacy Policy, contact us at{" "}
              <a
                href="mailto:info@seedtechllc.com"
                className="text-seed-400 hover:text-seed-300 underline underline-offset-2 transition-colors"
              >
                info@seedtechllc.com
              </a>.
            </p>
            <p className="mt-4">Thank you for trusting SeedTech LLC.</p>
          </section>
        </div>

        {/* Divider + CTA */}
        <div className="gradient-divider my-12" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} SeedTech LLC. All rights reserved.</p>
          <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
