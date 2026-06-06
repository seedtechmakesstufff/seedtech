"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FormGuard, useFormGuard } from "./FormGuard";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FD {
  // Step 1 — About You
  contactName: string; contactRole: string; contactEmail: string;
  contactPhone: string; preferredContact: string[]; bestTime: string;
  // Step 2 — Your Band
  bandName: string; genre: string; bandLocation: string; bandDescription: string;
  currentWebsite: string; ownsDomain: string; domainName: string; domainAccess: string;
  // Step 3 — Goals & Pages
  mainGoals: string[]; successCriteria: string; websiteType: string;
  pagesNeeded: string[]; needsEPK: string; epkContents: string[];
  // Step 4 — Tour Dates
  hasShows: string; showCount: string; tourManagement: string[]; tourDatePref: string;
  showDisplayInfo: string[]; archivePastShows: string;
  // Step 5 — Fan Voting
  wantsFanRequest: string; fanRequestTypes: string[]; targetVenues: string[];
  exampleVenues: string; showVoteTotals: string; requireEmailVote: string;
  fanSubmitFields: string[]; exportFanRequests: string; buildAdminDash: string;
  // Step 6 — Merch & Media
  sellsMerch: string; currentMerchPlatforms: string[]; merchTypes: string[];
  launchProductCount: string; inventoryTracking: string; shippingTax: string;
  fulfillmentMethod: string; helpSelectPlatform: string;
  musicPlatforms: string[]; musicLinks: string; embeddedPlayers: string;
  videoHosting: string[]; embeddedVideos: string;
  socialPlatforms: string[]; socialUrls: string; displaySocialPosts: string;
  socialToDisplay: string[]; socialManager: string;
  // Step 7 — Fan List & Design
  hasEmailList: string; emailPlatforms: string[]; fanSignup: string;
  fanSignupFor: string[]; helpEmailPlatform: string;
  brandingAssets: string[]; designDescription: string;
  sitesLike: string; sitesDislike: string;
  // Step 8 — Content & Technical
  hasContent: string; needsContentHelp: string; bandBio: string;
  bookingCopy: string; pressQuotes: string; mustMention: string; mustNotMention: string;
  inquiriesGoTo: string; inquiryTypes: string[]; separateForms: string;
  formTickets: string; notifChannels: string[];
  whoControls: string; domainAccess2: string; siteAdminAccess: string;
  hostingAccess: string; dnsAccess: string; hasAnalytics: string;
  hasSearchConsole: string; needsAccessHelp: string;
  integrationsNeeded: string[]; requiredIntegrations: string;
  // Step 9 — Timeline & Budget
  siteUpdater: string; teamCanUpdate: string[]; teamComfort: string;
  recordedHandoff: string; targetLaunchDate: string;
  launchDateReason: string[]; urgency: string; immovableDeadlines: string;
  budgetRange: string; priorityMatter: string;
  openToPhased: string; phasedFirst: string[];
  wantsOngoingSupport: string; supportTypes: string[]; updateFrequency: string;
  additionalNotes: string; concerns: string; hearAboutUs: string;
}

const INIT: FD = {
  contactName: "", contactRole: "", contactEmail: "", contactPhone: "",
  preferredContact: [], bestTime: "",
  bandName: "", genre: "", bandLocation: "", bandDescription: "",
  currentWebsite: "", ownsDomain: "", domainName: "", domainAccess: "",
  mainGoals: [], successCriteria: "", websiteType: "",
  pagesNeeded: [], needsEPK: "", epkContents: [],
  hasShows: "", showCount: "", tourManagement: [], tourDatePref: "",
  showDisplayInfo: [], archivePastShows: "",
  wantsFanRequest: "", fanRequestTypes: [], targetVenues: [],
  exampleVenues: "", showVoteTotals: "", requireEmailVote: "",
  fanSubmitFields: [], exportFanRequests: "", buildAdminDash: "",
  sellsMerch: "", currentMerchPlatforms: [], merchTypes: [],
  launchProductCount: "", inventoryTracking: "", shippingTax: "",
  fulfillmentMethod: "", helpSelectPlatform: "",
  musicPlatforms: [], musicLinks: "", embeddedPlayers: "",
  videoHosting: [], embeddedVideos: "",
  socialPlatforms: [], socialUrls: "", displaySocialPosts: "",
  socialToDisplay: [], socialManager: "",
  hasEmailList: "", emailPlatforms: [], fanSignup: "",
  fanSignupFor: [], helpEmailPlatform: "",
  brandingAssets: [], designDescription: "",
  sitesLike: "", sitesDislike: "",
  hasContent: "", needsContentHelp: "", bandBio: "",
  bookingCopy: "", pressQuotes: "", mustMention: "", mustNotMention: "",
  inquiriesGoTo: "", inquiryTypes: [], separateForms: "",
  formTickets: "", notifChannels: [],
  whoControls: "", domainAccess2: "", siteAdminAccess: "",
  hostingAccess: "", dnsAccess: "", hasAnalytics: "",
  hasSearchConsole: "", needsAccessHelp: "",
  integrationsNeeded: [], requiredIntegrations: "",
  siteUpdater: "", teamCanUpdate: [], teamComfort: "",
  recordedHandoff: "", targetLaunchDate: "",
  launchDateReason: [], urgency: "", immovableDeadlines: "",
  budgetRange: "", priorityMatter: "",
  openToPhased: "", phasedFirst: [],
  wantsOngoingSupport: "", supportTypes: [], updateFrequency: "",
  additionalNotes: "", concerns: "", hearAboutUs: "",
};

const TOTAL_STEPS = 9;

async function getToken(action: string): Promise<string> {
  try {
    const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!key || typeof window === "undefined" || !window.grecaptcha) return "";
    return await window.grecaptcha.execute(key, { action });
  } catch { return ""; }
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const cls = {
  input: "w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-seed-500/50 focus:ring-1 focus:ring-seed-500/30 transition-all",
  label: "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider",
  section: "space-y-5",
  sub: "text-xs text-white/30 mt-1",
};

// ─── Reusable helpers ─────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={cls.label}>{label}</label>
      {children}
      {hint && <p className={cls.sub}>{hint}</p>}
    </div>
  );
}

function Checks({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selected.includes(opt)
              ? "bg-seed-500/20 border-seed-500/40 text-seed-300"
              : "bg-white/[0.03] border-white/[0.08] text-white/45 hover:border-white/20 hover:text-white/65"
          }`}
        >{opt}</button>
      ))}
    </div>
  );
}

function Radios({ options, value, onChange, cols = 2 }: {
  options: string[]; value: string; onChange: (v: string) => void; cols?: number;
}) {
  return (
    <div className={`grid gap-2 pt-1 ${cols === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
            value === opt
              ? "bg-seed-500/10 border-seed-500/30 text-white"
              : "bg-white/[0.02] border-white/[0.06] text-white/45 hover:border-white/15 hover:text-white/65"
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            value === opt ? "border-seed-400" : "border-white/25"
          }`}>
            {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-seed-400" />}
          </div>
          <span className="text-xs">{opt}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Step content ─────────────────────────────────────────────────────────────

function Step1({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Contact Name *">
          <input value={fd.contactName} onChange={e => set("contactName", e.target.value)}
            placeholder="Your full name" className={cls.input} />
        </Field>
        <Field label="Role / Relationship to the Band">
          <select value={fd.contactRole} onChange={e => set("contactRole", e.target.value)} className={cls.input}>
            <option value="">Select role…</option>
            {["Band member","Manager","Booking agent","Label representative","Promoter","Tour manager","Other"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email Address *">
          <input type="email" value={fd.contactEmail} onChange={e => set("contactEmail", e.target.value)}
            placeholder="you@example.com" className={cls.input} />
        </Field>
        <Field label="Phone Number">
          <input type="tel" value={fd.contactPhone} onChange={e => set("contactPhone", e.target.value)}
            placeholder="(555) 000-0000" className={cls.input} />
        </Field>
      </div>
      <Field label="Preferred Contact Method">
        <Checks
          options={["Email","Phone call","Text","Zoom / Google Meet","Other"]}
          selected={fd.preferredContact}
          onChange={v => setArr("preferredContact", v)}
        />
      </Field>
      <Field label="Best Time to Reach You">
        <input value={fd.bestTime} onChange={e => set("bestTime", e.target.value)}
          placeholder="e.g. Weekday mornings, evenings after 7pm…" className={cls.input} />
      </Field>
    </div>
  );
}

function Step2({ fd, set }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr?: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Band / Artist Name *">
          <input value={fd.bandName} onChange={e => set("bandName", e.target.value)}
            placeholder="Official name" className={cls.input} />
        </Field>
        <Field label="Genre / Style of Music">
          <input value={fd.genre} onChange={e => set("genre", e.target.value)}
            placeholder="e.g. Rock, Country, Hip-Hop, Jazz…" className={cls.input} />
        </Field>
      </div>
      <Field label="Where is the Band Based?">
        <input value={fd.bandLocation} onChange={e => set("bandLocation", e.target.value)}
          placeholder="City / State / Country" className={cls.input} />
      </Field>
      <Field label="Describe the Band" hint="Sound, history, audience, current momentum, notable shows, influences — anything that helps us understand the brand.">
        <textarea rows={4} value={fd.bandDescription} onChange={e => set("bandDescription", e.target.value)}
          placeholder="Tell us about the band…" className={cls.input} />
      </Field>
      <Field label="Current Website URL" hint="Leave blank if you don't have one.">
        <input value={fd.currentWebsite} onChange={e => set("currentWebsite", e.target.value)}
          placeholder="https://bandname.com" className={cls.input} />
      </Field>
      <Field label="Do you own your domain name?">
        <Radios options={["Yes","No","Not sure"]} value={fd.ownsDomain} onChange={v => set("ownsDomain", v)} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Domain Name" hint="e.g. bandname.com">
          <input value={fd.domainName} onChange={e => set("domainName", e.target.value)}
            placeholder="bandname.com" className={cls.input} />
        </Field>
        <Field label="Who Controls the Domain Account?" hint="e.g. GoDaddy, Namecheap, manager, former developer…">
          <input value={fd.domainAccess} onChange={e => set("domainAccess", e.target.value)}
            placeholder="GoDaddy — managed by our manager" className={cls.input} />
        </Field>
      </div>
    </div>
  );
}

function Step3({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <Field label="What is the Main Goal of the New Website?">
        <Checks
          options={[
            "Promote upcoming tour dates","Help fans request/vote for future show locations",
            "Sell merchandise","Showcase music and videos","Build an email/text fan list",
            "Display social media content","Provide booking/contact information",
            "Replace an outdated website","Create a more professional presence","Other",
          ]}
          selected={fd.mainGoals}
          onChange={v => setArr("mainGoals", v)}
        />
      </Field>
      <Field label="What Would Make This Project Successful?">
        <textarea rows={3} value={fd.successCriteria} onChange={e => set("successCriteria", e.target.value)}
          placeholder="Describe what success looks like for you…" className={cls.input} />
      </Field>
      <Field label="Simple Band Website or Custom Platform?">
        <Radios cols={1}
          options={[
            "Simple band website",
            "Website with tour dates and merch",
            "Website with voting/request-a-show features",
            "Custom platform with backend management",
            "Not sure yet",
          ]}
          value={fd.websiteType}
          onChange={v => set("websiteType", v)}
        />
      </Field>
      <Field label="Which Pages Do You Want?">
        <Checks
          options={[
            "Home","Tour Dates / Shows","Request a Show / Vote for Your City","Merch Store",
            "Music","Videos","About / Bio","Photos / Gallery","Press Kit / EPK","Contact",
            "Booking Inquiry","Newsletter Signup","Fan Club / Community","Blog / News","Other",
          ]}
          selected={fd.pagesNeeded}
          onChange={v => setArr("pagesNeeded", v)}
        />
      </Field>
      <Field label="Do You Need an EPK Page?">
        <Radios options={["Yes","No","Maybe"]} value={fd.needsEPK} onChange={v => set("needsEPK", v)} />
      </Field>
      {fd.needsEPK === "Yes" && (
        <Field label="What Should Be Included in the EPK?">
          <Checks
            options={[
              "Band bio","Press photos","Logos","Music links","Videos",
              "Past shows","Notable press","Booking contact","Technical rider",
              "Stage plot","Downloadable assets","Other",
            ]}
            selected={fd.epkContents}
            onChange={v => setArr("epkContents", v)}
          />
        </Field>
      )}
    </div>
  );
}

function Step4({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <Field label="Do You Currently Have Upcoming Shows?">
        <Radios
          options={["Yes","No","Some are confirmed, others are pending"]}
          value={fd.hasShows} onChange={v => set("hasShows", v)} cols={1}
        />
      </Field>
      <Field label="How Many Upcoming Shows Do You Need Listed?">
        <select value={fd.showCount} onChange={e => set("showCount", e.target.value)} className={cls.input}>
          <option value="">Select range…</option>
          {["1–5","6–15","16–30","31–50","50+"].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="How Do You Currently Manage Tour Dates?">
        <Checks
          options={[
            "Spreadsheet","Bandsintown","Songkick","Eventbrite","Facebook Events",
            "Ticketmaster / Live Nation","Venue websites","Manually on current website",
            "We do not have a system yet","Other",
          ]}
          selected={fd.tourManagement}
          onChange={v => setArr("tourManagement", v)}
        />
      </Field>
      <Field label="Manual Entry or Platform Integration?">
        <Radios
          options={["Manual entry is fine","Prefer integration if possible","Not sure"]}
          value={fd.tourDatePref} onChange={v => set("tourDatePref", v)} cols={1}
        />
      </Field>
      <Field label="What Information Should Each Show Display?">
        <Checks
          options={[
            "Date","Venue name","City / state","Doors time","Show time","Age restriction",
            "Ticket link","RSVP link","Supporting acts","Venue address","Map link",
            "Sold out label","Low ticket warning","Poster / show image","Other",
          ]}
          selected={fd.showDisplayInfo}
          onChange={v => setArr("showDisplayInfo", v)}
        />
      </Field>
      <Field label="Archive Past Shows on the Website?">
        <Radios options={["Yes","No","Maybe later"]} value={fd.archivePastShows} onChange={v => set("archivePastShows", v)} />
      </Field>
    </div>
  );
}

function Step5({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <Field label="Do You Want Fans to Request Where the Band Should Play?">
        <Radios options={["Yes","No","Maybe"]} value={fd.wantsFanRequest} onChange={v => set("wantsFanRequest", v)} />
      </Field>
      <Field label="What Type of Request Feature Are You Interested In?">
        <Checks
          options={[
            "Fans vote for a city","Fans suggest a venue","Fans suggest a bar/small venue",
            "Fans request a private event","Fans request a college show",
            "Fans request a festival appearance","Fans enter contact info to measure interest","Other",
          ]}
          selected={fd.fanRequestTypes}
          onChange={v => setArr("fanRequestTypes", v)}
        />
      </Field>
      <Field label="What Venue Size Are You Targeting?">
        <Checks
          options={[
            "Bars","Small music venues","Clubs","Breweries","Restaurants with live music",
            "Local theaters","House shows","Colleges","Festivals","Other",
          ]}
          selected={fd.targetVenues}
          onChange={v => setArr("targetVenues", v)}
        />
      </Field>
      <Field label="Example Venues or Target Venue Types" hint={'e.g. "Places like The Stanhope House in NJ — smaller venues, bars, clubs, local rooms."'}>
        <textarea rows={3} value={fd.exampleVenues} onChange={e => set("exampleVenues", e.target.value)}
          placeholder="Describe the type of venues you're targeting…" className={cls.input} />
      </Field>
      <Field label="Should Fans See Vote Totals Publicly?">
        <Radios cols={1}
          options={["Yes, show public vote totals","Yes, but only show top cities/venues","No, keep vote totals private","Not sure"]}
          value={fd.showVoteTotals} onChange={v => set("showVoteTotals", v)}
        />
      </Field>
      <Field label="Should Fan Voting Require an Email Address?">
        <Radios options={["Yes","No","Optional","Not sure"]} value={fd.requireEmailVote} onChange={v => set("requireEmailVote", v)} />
      </Field>
      <Field label="What Information Should Fans Submit When Requesting a City or Venue?">
        <Checks
          options={[
            "Name","Email","Phone","City","State","Venue name","Venue website",
            "Venue contact info","How many people they think would attend","Comment/message",
            "Social handle","Other",
          ]}
          selected={fd.fanSubmitFields}
          onChange={v => setArr("fanSubmitFields", v)}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Export Fan Requests?">
          <Radios options={["Yes","No","Not sure"]} value={fd.exportFanRequests} onChange={v => set("exportFanRequests", v)} cols={1} />
        </Field>
        <Field label="Build an Admin Dashboard for Managing Requests?">
          <Radios options={["Yes","No","Maybe later"]} value={fd.buildAdminDash} onChange={v => set("buildAdminDash", v)} cols={1} />
        </Field>
      </div>
    </div>
  );
}

function Step6({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pb-1 border-b border-white/[0.06]">Merchandise</p>
      <Field label="Do You Currently Sell Merchandise Online?">
        <Radios options={["Yes","No","Not yet, but we want to"]} value={fd.sellsMerch} onChange={v => set("sellsMerch", v)} cols={1} />
      </Field>
      <Field label="Where Do You Currently Sell Merch?">
        <Checks
          options={["Shopify","WooCommerce","Square","Big Cartel","Bandcamp","Etsy","Merch company / fulfillment provider","In-person only","We do not sell merch yet","Other"]}
          selected={fd.currentMerchPlatforms} onChange={v => setArr("currentMerchPlatforms", v)}
        />
      </Field>
      <Field label="Types of Merch You Sell or Plan to Sell">
        <Checks
          options={["T-shirts","Hoodies","Hats","Vinyl","CDs","Posters","Stickers","Accessories","Digital downloads","Bundles","Limited drops","Tour-exclusive items","Other"]}
          selected={fd.merchTypes} onChange={v => setArr("merchTypes", v)}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Products at Launch">
          <select value={fd.launchProductCount} onChange={e => set("launchProductCount", e.target.value)} className={cls.input}>
            <option value="">Select…</option>
            {["1–5","6–15","16–30","31–50","50+"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Inventory Tracking?">
          <Radios options={["Yes","No","Not sure"]} value={fd.inventoryTracking} onChange={v => set("inventoryTracking", v)} cols={1} />
        </Field>
        <Field label="Shipping / Tax Setup?">
          <Radios options={["Yes","No","Not sure"]} value={fd.shippingTax} onChange={v => set("shippingTax", v)} cols={1} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Who Will Fulfill Merch Orders?">
          <Radios cols={1}
            options={["Band/team","Third-party merch company","Print-on-demand provider","Not sure yet"]}
            value={fd.fulfillmentMethod} onChange={v => set("fulfillmentMethod", v)}
          />
        </Field>
        <Field label="Help Selecting an Ecommerce Platform?">
          <Radios options={["Yes","No","Maybe"]} value={fd.helpSelectPlatform} onChange={v => set("helpSelectPlatform", v)} cols={1} />
        </Field>
      </div>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Music & Video</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Music Platforms">
          <Checks
            options={["Spotify","Apple Music","YouTube Music","SoundCloud","Bandcamp","Amazon Music","Tidal","Other"]}
            selected={fd.musicPlatforms} onChange={v => setArr("musicPlatforms", v)}
          />
        </Field>
        <Field label="Video Hosting">
          <Checks
            options={["YouTube","Vimeo","Instagram","TikTok","Facebook","Other"]}
            selected={fd.videoHosting} onChange={v => setArr("videoHosting", v)}
          />
        </Field>
      </div>
      <Field label="Music Links to Include on the Website">
        <textarea rows={2} value={fd.musicLinks} onChange={e => set("musicLinks", e.target.value)}
          placeholder="List Spotify, Apple Music, SoundCloud links etc." className={cls.input} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Embed Music Players on Site?">
          <Radios options={["Yes","No","Maybe"]} value={fd.embeddedPlayers} onChange={v => set("embeddedPlayers", v)} cols={1} />
        </Field>
        <Field label="Embed Videos on Site?">
          <Radios options={["Yes","No","Maybe"]} value={fd.embeddedVideos} onChange={v => set("embeddedVideos", v)} cols={1} />
        </Field>
      </div>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Social Media</p>
      <Field label="Social Platforms to Link on Website">
        <Checks
          options={["Instagram","TikTok","Facebook","YouTube","X / Twitter","Threads","Spotify","Apple Music","SoundCloud","Bandcamp","Discord","Twitch","Other"]}
          selected={fd.socialPlatforms} onChange={v => setArr("socialPlatforms", v)}
        />
      </Field>
      <Field label="Official Social Media URLs">
        <textarea rows={3} value={fd.socialUrls} onChange={e => set("socialUrls", e.target.value)}
          placeholder="List all official social URLs, one per line…" className={cls.input} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Display Recent Social Posts on Site?">
          <Radios cols={1}
            options={["Yes","No, just social links","Maybe, depending on cost/platform limitations"]}
            value={fd.displaySocialPosts} onChange={v => set("displaySocialPosts", v)}
          />
        </Field>
        <Field label="Who Manages Your Social Media?">
          <input value={fd.socialManager} onChange={e => set("socialManager", e.target.value)}
            placeholder="Band member, manager, agency…" className={cls.input} />
        </Field>
      </div>
    </div>
  );
}

function Step7({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pb-1 border-b border-white/[0.06]">Fan List & Email Capture</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Do You Have an Email List / Fan Database?">
          <Radios options={["Yes","No","Not sure"]} value={fd.hasEmailList} onChange={v => set("hasEmailList", v)} cols={1} />
        </Field>
        <Field label="Email Marketing Platform">
          <Checks
            options={["Mailchimp","Klaviyo","Constant Contact","ConvertKit","Shopify Email","Square Marketing","None yet","Other"]}
            selected={fd.emailPlatforms} onChange={v => setArr("emailPlatforms", v)}
          />
        </Field>
      </div>
      <Field label="Should Fans Be Able to Sign Up for Updates?">
        <Radios options={["Yes","No","Maybe"]} value={fd.fanSignup} onChange={v => set("fanSignup", v)} />
      </Field>
      <Field label="What Can Fans Sign Up For?">
        <Checks
          options={["Tour announcements","Merch drops","New music releases","Local show alerts","VIP / fan club updates","General newsletter","Other"]}
          selected={fd.fanSignupFor} onChange={v => setArr("fanSignupFor", v)}
        />
      </Field>
      <Field label="Help Setting Up an Email Marketing Platform?">
        <Radios options={["Yes","No","Maybe"]} value={fd.helpEmailPlatform} onChange={v => set("helpEmailPlatform", v)} />
      </Field>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Design & Branding</p>
      <Field label="Branding Assets You Already Have">
        <Checks
          options={["Logo","Band photos","Album artwork","Fonts","Color palette","Posters","Press photos","Brand guidelines","We need help with this","Other"]}
          selected={fd.brandingAssets} onChange={v => setArr("brandingAssets", v)}
        />
      </Field>
      <p className="text-xs text-white/30 mt-1">File uploads (logos, photos, artwork) can be sent separately — we&apos;ll follow up after you submit.</p>
      <Field label="Describe the Look and Feel You Want" hint="e.g. gritty, polished, punk, retro, dark, clean, cinematic, high-energy, minimalist…">
        <textarea rows={3} value={fd.designDescription} onChange={e => set("designDescription", e.target.value)}
          placeholder="Describe the vibe, mood, and aesthetic you're going for…" className={cls.input} />
      </Field>
      <Field label="List 2–5 Websites You Like" hint="Include URLs and what you like about each.">
        <textarea rows={3} value={fd.sitesLike} onChange={e => set("sitesLike", e.target.value)}
          placeholder="https://example.com — love the dark layout and tour date section…" className={cls.input} />
      </Field>
      <Field label="List Any Websites You Dislike" hint="Include URLs and what you don't like.">
        <textarea rows={2} value={fd.sitesDislike} onChange={e => set("sitesDislike", e.target.value)}
          placeholder="https://example.com — feels dated, too cluttered…" className={cls.input} />
      </Field>
    </div>
  );
}

function Step8({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pb-1 border-b border-white/[0.06]">Content</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Do You Have Written Website Content?">
          <Radios options={["Yes","Some","No, we need help writing it"]} value={fd.hasContent} onChange={v => set("hasContent", v)} cols={1} />
        </Field>
        <Field label="Need SeedTech to Help Write or Edit Content?">
          <Radios options={["Yes","No","Maybe"]} value={fd.needsContentHelp} onChange={v => set("needsContentHelp", v)} cols={1} />
        </Field>
      </div>
      <Field label="Band Bio">
        <textarea rows={3} value={fd.bandBio} onChange={e => set("bandBio", e.target.value)}
          placeholder="Paste your bio or key points…" className={cls.input} />
      </Field>
      <Field label="Booking / Contact Copy">
        <textarea rows={2} value={fd.bookingCopy} onChange={e => set("bookingCopy", e.target.value)}
          placeholder="What should the booking contact section say?" className={cls.input} />
      </Field>
      <Field label="Press Quotes, Notable Shows, or Accomplishments">
        <textarea rows={2} value={fd.pressQuotes} onChange={e => set("pressQuotes", e.target.value)}
          placeholder="Any press quotes, notable venues, milestones…" className={cls.input} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Anything That Must Be Mentioned?">
          <textarea rows={2} value={fd.mustMention} onChange={e => set("mustMention", e.target.value)}
            placeholder="Critical info, upcoming releases, tour sponsors…" className={cls.input} />
        </Field>
        <Field label="Anything That Should NOT Be Mentioned?">
          <textarea rows={2} value={fd.mustNotMention} onChange={e => set("mustNotMention", e.target.value)}
            placeholder="Former members, past conflicts, old branding…" className={cls.input} />
        </Field>
      </div>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Booking & Contact</p>
      <Field label="Who Should Website Inquiries Go To?">
        <input value={fd.inquiriesGoTo} onChange={e => set("inquiriesGoTo", e.target.value)}
          placeholder="Name, email, or role…" className={cls.input} />
      </Field>
      <Field label="Types of Inquiries the Site Should Support">
        <Checks
          options={["Booking","Press/media","Merch/order questions","General fan contact","Private events","Venue suggestions","Sponsorships","Other"]}
          selected={fd.inquiryTypes} onChange={v => setArr("inquiryTypes", v)}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Separate Forms for Different Inquiry Types?">
          <Radios options={["Yes","No","Not sure"]} value={fd.separateForms} onChange={v => set("separateForms", v)} cols={1} />
        </Field>
        <Field label="Should Submissions Create a Ticket / Notification?">
          <Radios options={["Yes","No","Not sure"]} value={fd.formTickets} onChange={v => set("formTickets", v)} cols={1} />
        </Field>
      </div>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Technical Access</p>
      <Field label="Who Currently Controls Website / Domain / Hosting Accounts?">
        <textarea rows={2} value={fd.whoControls} onChange={e => set("whoControls", e.target.value)}
          placeholder="List who controls each account and their contact…" className={cls.input} />
      </Field>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Field label="Domain Registrar Access?">
          <Radios options={["Yes","No","Not sure"]} value={fd.domainAccess2} onChange={v => set("domainAccess2", v)} cols={1} />
        </Field>
        <Field label="Current Website Admin?">
          <Radios options={["Yes","No","Not sure","No current site"]} value={fd.siteAdminAccess} onChange={v => set("siteAdminAccess", v)} cols={1} />
        </Field>
        <Field label="Hosting Access?">
          <Radios options={["Yes","No","Not sure","No hosting"]} value={fd.hostingAccess} onChange={v => set("hostingAccess", v)} cols={1} />
        </Field>
        <Field label="DNS Settings Access?">
          <Radios options={["Yes","No","Not sure"]} value={fd.dnsAccess} onChange={v => set("dnsAccess", v)} cols={1} />
        </Field>
        <Field label="Google Analytics Installed?">
          <Radios options={["Yes","No","Not sure"]} value={fd.hasAnalytics} onChange={v => set("hasAnalytics", v)} cols={1} />
        </Field>
        <Field label="Google Search Console?">
          <Radios options={["Yes","No","Not sure"]} value={fd.hasSearchConsole} onChange={v => set("hasSearchConsole", v)} cols={1} />
        </Field>
      </div>
      <Field label="Need Help Recovering or Organizing Account Access?">
        <Radios options={["Yes","No","Maybe"]} value={fd.needsAccessHelp} onChange={v => set("needsAccessHelp", v)} />
      </Field>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Integrations</p>
      <Field label="Which Integrations Might Be Needed?">
        <Checks
          options={[
            "Ticket links","Bandsintown","Songkick","Shopify","WooCommerce","Square","Stripe","PayPal",
            "Mailchimp","Klaviyo","Google Analytics","Meta Pixel","TikTok Pixel","YouTube","Spotify",
            "Apple Music","Instagram","TikTok","Discord","Other",
          ]}
          selected={fd.integrationsNeeded} onChange={v => setArr("integrationsNeeded", v)}
        />
      </Field>
      <Field label="Any Required Integrations or Platforms?">
        <textarea rows={2} value={fd.requiredIntegrations} onChange={e => set("requiredIntegrations", e.target.value)}
          placeholder="List any must-have integrations and whether you have existing accounts…" className={cls.input} />
      </Field>
    </div>
  );
}

function Step9({ fd, set, setArr }: { fd: FD; set: (k: keyof FD, v: string) => void; setArr: (k: keyof FD, v: string[]) => void }) {
  return (
    <div className={cls.section}>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pb-1 border-b border-white/[0.06]">Admin & Management</p>
      <Field label="Who Will Update the Website After Launch?">
        <Radios cols={1}
          options={["Band/team","Manager","Booking agent","SeedTech","Not sure"]}
          value={fd.siteUpdater} onChange={v => set("siteUpdater", v)}
        />
      </Field>
      <Field label="What Should Your Team Be Able to Update Without Contacting SeedTech?">
        <Checks
          options={["Tour dates","Merch products","Photos","Videos","Blog/news posts","Homepage announcements","Fan vote/request results","Email signup forms","Contact information","Other"]}
          selected={fd.teamCanUpdate} onChange={v => setArr("teamCanUpdate", v)}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="How Comfortable Is Your Team with Managing Website Content?">
          <Radios cols={1}
            options={["Very comfortable","Somewhat comfortable","Not comfortable","We want SeedTech to handle most updates"]}
            value={fd.teamComfort} onChange={v => set("teamComfort", v)}
          />
        </Field>
        <Field label="Recorded Handoff / Training Walkthrough?">
          <Radios options={["Yes","No","Maybe"]} value={fd.recordedHandoff} onChange={v => set("recordedHandoff", v)} cols={1} />
        </Field>
      </div>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Timeline</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Target Launch Date">
          <input type="date" value={fd.targetLaunchDate} onChange={e => set("targetLaunchDate", e.target.value)} className={cls.input} />
        </Field>
        <Field label="Why Is That Date Important?">
          <Checks
            options={["Tour announcement","Album/single release","Merch drop","Press campaign","Upcoming show","Manager/label deadline","No specific reason","Other"]}
            selected={fd.launchDateReason} onChange={v => setArr("launchDateReason", v)}
          />
        </Field>
      </div>
      <Field label="How Urgent Is This Project?">
        <Radios
          options={["ASAP","Within 2–4 weeks","Within 1–2 months","Flexible","Researching options"]}
          value={fd.urgency} onChange={v => set("urgency", v)}
        />
      </Field>
      <Field label="Any Immovable Deadlines?">
        <textarea rows={2} value={fd.immovableDeadlines} onChange={e => set("immovableDeadlines", e.target.value)}
          placeholder="Describe any hard deadlines and why they can't move…" className={cls.input} />
      </Field>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Budget & Scope</p>
      <Field label="Budget Range">
        <Radios cols={1}
          options={["Under $2,500","$2,500–$5,000","$5,000–$10,000","$10,000–$20,000","$20,000+","Not sure yet"]}
          value={fd.budgetRange} onChange={v => set("budgetRange", v)}
        />
      </Field>
      <Field label="What Matters Most Right Now?">
        <Radios cols={1}
          options={[
            "Launching quickly","Keeping the project affordable","Building something highly custom",
            "Creating a premium/professional brand presence","Merch/ecommerce",
            "Fan voting/request-a-show functionality","Long-term scalability",
          ]}
          value={fd.priorityMatter} onChange={v => set("priorityMatter", v)}
        />
      </Field>
      <Field label="Open to Phased Development?">
        <Radios options={["Yes","No","Maybe"]} value={fd.openToPhased} onChange={v => set("openToPhased", v)} />
      </Field>
      {fd.openToPhased !== "No" && (
        <Field label="If Phased, Which Should Come First?">
          <Checks
            options={["Basic website","Tour dates","Request-a-show/voting","Merch store","Social embeds","Email capture","Admin dashboard","Other"]}
            selected={fd.phasedFirst} onChange={v => setArr("phasedFirst", v)}
          />
        </Field>
      )}

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Ongoing Support</p>
      <Field label="Want Ongoing Website Support After Launch?">
        <Radios options={["Yes","No","Maybe"]} value={fd.wantsOngoingSupport} onChange={v => set("wantsOngoingSupport", v)} />
      </Field>
      <Field label="What Type of Support Would Be Helpful?">
        <Checks
          options={["Website updates","Tour date updates","Merch/product updates","Security updates","Hosting support","Analytics/reporting","SEO/content support","Email list support","New feature development","Other"]}
          selected={fd.supportTypes} onChange={v => setArr("supportTypes", v)}
        />
      </Field>
      <Field label="How Often Do You Expect Website Updates?">
        <Radios
          options={["Weekly","Monthly","A few times per year","Only during tour cycles","Not sure"]}
          value={fd.updateFrequency} onChange={v => set("updateFrequency", v)}
        />
      </Field>

      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest pt-2 pb-1 border-b border-white/[0.06]">Final Notes</p>
      <Field label="Is There Anything Else We Should Know?">
        <textarea rows={3} value={fd.additionalNotes} onChange={e => set("additionalNotes", e.target.value)}
          placeholder="Any other context, constraints, or details that would help us…" className={cls.input} />
      </Field>
      <Field label="Any Specific Concerns, Risks, or Must-Not-Miss Details?">
        <textarea rows={2} value={fd.concerns} onChange={e => set("concerns", e.target.value)}
          placeholder="Things you've had problems with before, sensitivities, critical requirements…" className={cls.input} />
      </Field>
      <Field label="How Did You Hear About SeedTech?">
        <select value={fd.hearAboutUs} onChange={e => set("hearAboutUs", e.target.value)} className={cls.input}>
          <option value="">Select…</option>
          {["Referral","Existing client","Google","Social media","Saw SeedTech's work","Band/manager referral","Other"].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS = [
  { title: "About You", description: "Who's filling out this form?" },
  { title: "Your Band", description: "Tell us about the act and your current setup." },
  { title: "Goals & Pages", description: "What should this website accomplish?" },
  { title: "Tour Dates", description: "How do you manage shows today?" },
  { title: "Fan Voting", description: "Should fans be able to request show locations?" },
  { title: "Merch & Media", description: "Merchandise, music, videos, and social." },
  { title: "Fan List & Design", description: "Email capture and visual direction." },
  { title: "Content & Technical", description: "Content, access, and integrations." },
  { title: "Timeline & Budget", description: "Timeline, budget, and final notes." },
];

// ─── Main form ────────────────────────────────────────────────────────────────

export function BandIntakeForm() {
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<FD>(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const guard = useFormGuard();

  function set(k: keyof FD, v: string) {
    setFd(prev => ({ ...prev, [k]: v }));
  }

  function setArr(k: keyof FD, v: string[]) {
    setFd(prev => ({ ...prev, [k]: v }));
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
  }

  function back() {
    if (step > 0) setStep(s => s - 1);
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fd.contactName.trim() || !fd.contactEmail.trim() || !fd.bandName.trim()) {
      setError("Contact name, email, and band name are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await getToken("band_intake");
      const res = await fetch("/api/band-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fd, recaptchaToken: token, ...guard.fields() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Submission failed.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-5">
        <div className="w-16 h-16 rounded-full bg-seed-500/10 border border-seed-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-seed-400" />
        </div>
        <div>
          <h3 className="font-display text-heading text-white mb-2">Intake Received</h3>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Thanks, {fd.contactName.split(" ")[0]}. We&apos;ll review your submission for{" "}
            <span className="text-white/70">{fd.bandName}</span> and reach out within 1–2 business days.
          </p>
        </div>
        <p className="text-xs text-white/25 max-w-xs mx-auto">
          If you have logos, photos, or other files to share, feel free to email them to us — we&apos;ll connect them to your intake.
        </p>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const current = STEPS[step];
  const stepProps = { fd, set, setArr };
  const isLast = step === TOTAL_STEPS - 1;

  const stepContent = [
    <Step1 key={0} {...stepProps} />,
    <Step2 key={1} {...stepProps} />,
    <Step3 key={2} {...stepProps} />,
    <Step4 key={3} {...stepProps} />,
    <Step5 key={4} {...stepProps} />,
    <Step6 key={5} {...stepProps} />,
    <Step7 key={6} {...stepProps} />,
    <Step8 key={7} {...stepProps} />,
    <Step9 key={8} {...stepProps} />,
  ];

  return (
    <form onSubmit={isLast ? submit : (e) => { e.preventDefault(); next(); }} className="space-y-8">
      <FormGuard started={guard.started} />

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-0.5">
              Step {step + 1} of {TOTAL_STEPS}
            </p>
            <h2 className="font-display text-subheading text-white">{current.title}</h2>
            <p className="text-xs text-white/45 mt-0.5">{current.description}</p>
          </div>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-seed-600 to-seed-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step fields */}
      <div className="liquid-glass rounded-2xl p-6 md:p-8">
        {stepContent[step]}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button" onClick={back} disabled={step === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit" disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-seed-600 to-seed-500 text-white text-sm font-medium hover:shadow-glowSeed transition-all disabled:opacity-60"
        >
          {loading ? "Submitting…" : isLast ? "Submit Intake" : "Continue"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-center text-xs text-white/20">
        Your information is kept private and used only to scope your project.
      </p>
    </form>
  );
}
