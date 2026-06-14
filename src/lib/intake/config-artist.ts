import type { IntakeConfig } from "./types";

/* ── Artist & Touring Website intake ──
 * (Formerly the "Band & Touring" intake — renamed to Artist.)
 */

export const ARTIST_INTAKE_CONFIG: IntakeConfig = {
  key: "artist",
  source: "artist_intake",
  serviceLabel: "Artist Website Intake",
  endpoint: "/api/artist-intake",
  recaptchaAction: "artist_intake",
  leadSource: "artist_intake",
  entityNameKey: "artistName",
  entityTitle: "Artist",
  formName: "Artist & Touring Website",
  notifyEmoji: "🎸",
  emailTags: "Web Development · Artist Website · Entertainment · Tour Dates · Intake Submitted",
  steps: [
    // ── Step 1 ───────────────────────────────────────────────
    {
      title: "About You",
      description: "Who's filling out this form?",
      sections: [
        {
          fields: [
            { key: "contactName", label: "Contact Name *", type: "text", placeholder: "Your full name", half: true, required: true },
            { key: "contactRole", label: "Role / Relationship to the Artist", type: "select", half: true,
              options: ["Band member", "Solo artist", "Manager", "Booking agent", "Label representative", "Promoter", "Tour manager", "Other"] },
            { key: "contactEmail", label: "Email Address *", type: "email", placeholder: "you@example.com", half: true, required: true },
            { key: "contactPhone", label: "Phone Number", type: "tel", placeholder: "(555) 000-0000", half: true },
            { key: "preferredContact", label: "Preferred Contact Method", type: "checks",
              options: ["Email", "Phone call", "Text", "Zoom / Google Meet", "Other"] },
            { key: "bestTime", label: "Best Time to Reach You", type: "text", placeholder: "e.g. Weekday mornings, evenings after 7pm…" },
          ],
        },
      ],
    },
    // ── Step 2 ───────────────────────────────────────────────
    {
      title: "Your Artist",
      description: "Tell us about the act and your current setup.",
      sections: [
        {
          fields: [
            { key: "artistName", label: "Artist / Band Name *", type: "text", placeholder: "Official name", half: true, required: true },
            { key: "genre", label: "Genre / Style of Music", type: "text", placeholder: "e.g. Rock, Country, Hip-Hop, Jazz…", half: true },
            { key: "artistLocation", label: "Where is the Artist Based?", type: "text", placeholder: "City / State / Country" },
            { key: "artistDescription", label: "Describe the Artist", type: "textarea", rows: 4, placeholder: "Tell us about the act…",
              hint: "Sound, history, audience, current momentum, notable shows, influences — anything that helps us understand the brand." },
            { key: "currentWebsite", label: "Current Website URL", type: "text", placeholder: "https://artistname.com", hint: "Leave blank if you don't have one." },
            { key: "ownsDomain", label: "Do you own your domain name?", type: "radios", options: ["Yes", "No", "Not sure"] },
            { key: "domainName", label: "Domain Name", type: "text", placeholder: "artistname.com", hint: "e.g. artistname.com", half: true },
            { key: "domainAccess", label: "Who Controls the Domain Account?", type: "text", placeholder: "GoDaddy — managed by our manager",
              hint: "e.g. GoDaddy, Namecheap, manager, former developer…", half: true },
          ],
        },
      ],
    },
    // ── Step 3 ───────────────────────────────────────────────
    {
      title: "Goals & Pages",
      description: "What should this website accomplish?",
      sections: [
        {
          fields: [
            { key: "mainGoals", label: "What is the Main Goal of the New Website?", type: "checks",
              options: ["Promote upcoming tour dates", "Help fans request/vote for future show locations", "Sell merchandise",
                "Showcase music and videos", "Build an email/text fan list", "Display social media content",
                "Provide booking/contact information", "Replace an outdated website", "Create a more professional presence", "Other"] },
            { key: "successCriteria", label: "What Would Make This Project Successful?", type: "textarea", rows: 3, placeholder: "Describe what success looks like for you…" },
            { key: "websiteType", label: "Simple Artist Website or Custom Platform?", type: "radios", cols: 1,
              options: ["Simple artist website", "Website with tour dates and merch", "Website with voting/request-a-show features",
                "Custom platform with backend management", "Not sure yet"] },
            { key: "pagesNeeded", label: "Which Pages Do You Want?", type: "checks",
              options: ["Home", "Tour Dates / Shows", "Request a Show / Vote for Your City", "Merch Store", "Music", "Videos",
                "About / Bio", "Photos / Gallery", "Press Kit / EPK", "Contact", "Booking Inquiry", "Newsletter Signup",
                "Fan Club / Community", "Blog / News", "Other"] },
            { key: "needsEPK", label: "Do You Need an EPK Page?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "epkContents", label: "What Should Be Included in the EPK?", type: "checks",
              showIf: (d) => d.needsEPK === "Yes",
              options: ["Artist bio", "Press photos", "Logos", "Music links", "Videos", "Past shows", "Notable press",
                "Booking contact", "Technical rider", "Stage plot", "Downloadable assets", "Other"] },
          ],
        },
      ],
    },
    // ── Step 4 ───────────────────────────────────────────────
    {
      title: "Tour Dates",
      description: "How do you manage shows today?",
      sections: [
        {
          fields: [
            { key: "hasShows", label: "Do You Currently Have Upcoming Shows?", type: "radios", cols: 1,
              options: ["Yes", "No", "Some are confirmed, others are pending"] },
            { key: "showCount", label: "How Many Upcoming Shows Do You Need Listed?", type: "select",
              options: ["1–5", "6–15", "16–30", "31–50", "50+"] },
            { key: "tourManagement", label: "How Do You Currently Manage Tour Dates?", type: "checks",
              options: ["Spreadsheet", "Bandsintown", "Songkick", "Eventbrite", "Facebook Events", "Ticketmaster / Live Nation",
                "Venue websites", "Manually on current website", "We do not have a system yet", "Other"] },
            { key: "tourDatePref", label: "Manual Entry or Platform Integration?", type: "radios", cols: 1,
              options: ["Manual entry is fine", "Prefer integration if possible", "Not sure"] },
            { key: "showDisplayInfo", label: "What Information Should Each Show Display?", type: "checks",
              options: ["Date", "Venue name", "City / state", "Doors time", "Show time", "Age restriction", "Ticket link", "RSVP link",
                "Supporting acts", "Venue address", "Map link", "Sold out label", "Low ticket warning", "Poster / show image", "Other"] },
            { key: "archivePastShows", label: "Archive Past Shows on the Website?", type: "radios", options: ["Yes", "No", "Maybe later"] },
          ],
        },
      ],
    },
    // ── Step 5 ───────────────────────────────────────────────
    {
      title: "Fan Voting",
      description: "Should fans be able to request show locations?",
      sections: [
        {
          fields: [
            { key: "wantsFanRequest", label: "Do You Want Fans to Request Where the Artist Should Play?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "fanRequestTypes", label: "What Type of Request Feature Are You Interested In?", type: "checks",
              options: ["Fans vote for a city", "Fans suggest a venue", "Fans suggest a bar/small venue", "Fans request a private event",
                "Fans request a college show", "Fans request a festival appearance", "Fans enter contact info to measure interest", "Other"] },
            { key: "targetVenues", label: "What Venue Size Are You Targeting?", type: "checks",
              options: ["Bars", "Small music venues", "Clubs", "Breweries", "Restaurants with live music", "Local theaters",
                "House shows", "Colleges", "Festivals", "Other"] },
            { key: "exampleVenues", label: "Example Venues or Target Venue Types", type: "textarea", rows: 3, placeholder: "Describe the type of venues you're targeting…",
              hint: 'e.g. "Places like The Stanhope House in NJ — smaller venues, bars, clubs, local rooms."' },
            { key: "showVoteTotals", label: "Should Fans See Vote Totals Publicly?", type: "radios", cols: 1,
              options: ["Yes, show public vote totals", "Yes, but only show top cities/venues", "No, keep vote totals private", "Not sure"] },
            { key: "requireEmailVote", label: "Should Fan Voting Require an Email Address?", type: "radios", options: ["Yes", "No", "Optional", "Not sure"] },
            { key: "fanSubmitFields", label: "What Information Should Fans Submit When Requesting a City or Venue?", type: "checks",
              options: ["Name", "Email", "Phone", "City", "State", "Venue name", "Venue website", "Venue contact info",
                "How many people they think would attend", "Comment/message", "Social handle", "Other"] },
            { key: "exportFanRequests", label: "Export Fan Requests?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "buildAdminDash", label: "Build an Admin Dashboard for Managing Requests?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe later"] },
          ],
        },
      ],
    },
    // ── Step 6 ───────────────────────────────────────────────
    {
      title: "Merch & Media",
      description: "Merchandise, music, videos, and social.",
      sections: [
        {
          heading: "Merchandise",
          fields: [
            { key: "sellsMerch", label: "Do You Currently Sell Merchandise Online?", type: "radios", cols: 1, options: ["Yes", "No", "Not yet, but we want to"] },
            { key: "currentMerchPlatforms", label: "Where Do You Currently Sell Merch?", type: "checks",
              options: ["Shopify", "WooCommerce", "Square", "Big Cartel", "Bandcamp", "Etsy", "Merch company / fulfillment provider",
                "In-person only", "We do not sell merch yet", "Other"] },
            { key: "merchTypes", label: "Types of Merch You Sell or Plan to Sell", type: "checks",
              options: ["T-shirts", "Hoodies", "Hats", "Vinyl", "CDs", "Posters", "Stickers", "Accessories", "Digital downloads",
                "Bundles", "Limited drops", "Tour-exclusive items", "Other"] },
            { key: "launchProductCount", label: "Products at Launch", type: "select", half: true, options: ["1–5", "6–15", "16–30", "31–50", "50+"] },
            { key: "inventoryTracking", label: "Inventory Tracking?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "shippingTax", label: "Shipping / Tax Setup?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "fulfillmentMethod", label: "Who Will Fulfill Merch Orders?", type: "radios", cols: 1, half: true,
              options: ["Artist/team", "Third-party merch company", "Print-on-demand provider", "Not sure yet"] },
            { key: "helpSelectPlatform", label: "Help Selecting an Ecommerce Platform?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Music & Video",
          fields: [
            { key: "musicPlatforms", label: "Music Platforms", type: "checks", half: true,
              options: ["Spotify", "Apple Music", "YouTube Music", "SoundCloud", "Bandcamp", "Amazon Music", "Tidal", "Other"] },
            { key: "videoHosting", label: "Video Hosting", type: "checks", half: true,
              options: ["YouTube", "Vimeo", "Instagram", "TikTok", "Facebook", "Other"] },
            { key: "musicLinks", label: "Music Links to Include on the Website", type: "textarea", rows: 2, placeholder: "List Spotify, Apple Music, SoundCloud links etc." },
            { key: "embeddedPlayers", label: "Embed Music Players on Site?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
            { key: "embeddedVideos", label: "Embed Videos on Site?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Social Media",
          fields: [
            { key: "socialPlatforms", label: "Social Platforms to Link on Website", type: "checks",
              options: ["Instagram", "TikTok", "Facebook", "YouTube", "X / Twitter", "Threads", "Spotify", "Apple Music",
                "SoundCloud", "Bandcamp", "Discord", "Twitch", "Other"] },
            { key: "socialUrls", label: "Official Social Media URLs", type: "textarea", rows: 3, placeholder: "List all official social URLs, one per line…" },
            { key: "displaySocialPosts", label: "Display Recent Social Posts on Site?", type: "radios", cols: 1, half: true,
              options: ["Yes", "No, just social links", "Maybe, depending on cost/platform limitations"] },
            { key: "socialManager", label: "Who Manages Your Social Media?", type: "text", half: true, placeholder: "Artist, manager, agency…" },
          ],
        },
      ],
    },
    // ── Step 7 ───────────────────────────────────────────────
    {
      title: "Fan List & Design",
      description: "Email capture and visual direction.",
      sections: [
        {
          heading: "Fan List & Email Capture",
          fields: [
            { key: "hasEmailList", label: "Do You Have an Email List / Fan Database?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "emailPlatforms", label: "Email Marketing Platform", type: "checks", half: true,
              options: ["Mailchimp", "Klaviyo", "Constant Contact", "ConvertKit", "Shopify Email", "Square Marketing", "None yet", "Other"] },
            { key: "fanSignup", label: "Should Fans Be Able to Sign Up for Updates?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "fanSignupFor", label: "What Can Fans Sign Up For?", type: "checks",
              options: ["Tour announcements", "Merch drops", "New music releases", "Local show alerts", "VIP / fan club updates", "General newsletter", "Other"] },
            { key: "helpEmailPlatform", label: "Help Setting Up an Email Marketing Platform?", type: "radios", options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Design & Branding",
          fields: [
            { key: "brandingAssets", label: "Branding Assets You Already Have", type: "checks",
              hint: "File uploads (logos, photos, artwork) can be sent separately — we'll follow up after you submit.",
              options: ["Logo", "Artist photos", "Album artwork", "Fonts", "Color palette", "Posters", "Press photos", "Brand guidelines", "We need help with this", "Other"] },
            { key: "designDescription", label: "Describe the Look and Feel You Want", type: "textarea", rows: 3, placeholder: "Describe the vibe, mood, and aesthetic you're going for…",
              hint: "e.g. gritty, polished, punk, retro, dark, clean, cinematic, high-energy, minimalist…" },
            { key: "sitesLike", label: "List 2–5 Websites You Like", type: "textarea", rows: 3, placeholder: "https://example.com — love the dark layout and tour date section…",
              hint: "Include URLs and what you like about each." },
            { key: "sitesDislike", label: "List Any Websites You Dislike", type: "textarea", rows: 2, placeholder: "https://example.com — feels dated, too cluttered…",
              hint: "Include URLs and what you don't like." },
          ],
        },
      ],
    },
    // ── Step 8 ───────────────────────────────────────────────
    {
      title: "Content & Technical",
      description: "Content, access, and integrations.",
      sections: [
        {
          heading: "Content",
          fields: [
            { key: "hasContent", label: "Do You Have Written Website Content?", type: "radios", cols: 1, half: true, options: ["Yes", "Some", "No, we need help writing it"] },
            { key: "needsContentHelp", label: "Need SeedTech to Help Write or Edit Content?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
            { key: "artistBio", label: "Artist Bio", type: "textarea", rows: 3, placeholder: "Paste your bio or key points…" },
            { key: "bookingCopy", label: "Booking / Contact Copy", type: "textarea", rows: 2, placeholder: "What should the booking contact section say?" },
            { key: "pressQuotes", label: "Press Quotes, Notable Shows, or Accomplishments", type: "textarea", rows: 2, placeholder: "Any press quotes, notable venues, milestones…" },
            { key: "mustMention", label: "Anything That Must Be Mentioned?", type: "textarea", rows: 2, half: true, placeholder: "Critical info, upcoming releases, tour sponsors…" },
            { key: "mustNotMention", label: "Anything That Should NOT Be Mentioned?", type: "textarea", rows: 2, half: true, placeholder: "Former members, past conflicts, old branding…" },
          ],
        },
        {
          heading: "Booking & Contact",
          fields: [
            { key: "inquiriesGoTo", label: "Who Should Website Inquiries Go To?", type: "text", placeholder: "Name, email, or role…" },
            { key: "inquiryTypes", label: "Types of Inquiries the Site Should Support", type: "checks",
              options: ["Booking", "Press/media", "Merch/order questions", "General fan contact", "Private events", "Venue suggestions", "Sponsorships", "Other"] },
            { key: "separateForms", label: "Separate Forms for Different Inquiry Types?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "formTickets", label: "Should Submissions Create a Ticket / Notification?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
          ],
        },
        {
          heading: "Technical Access",
          fields: [
            { key: "whoControls", label: "Who Currently Controls Website / Domain / Hosting Accounts?", type: "textarea", rows: 2, placeholder: "List who controls each account and their contact…" },
            { key: "domainAccess2", label: "Domain Registrar Access?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "siteAdminAccess", label: "Current Website Admin?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure", "No current site"] },
            { key: "hostingAccess", label: "Hosting Access?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure", "No hosting"] },
            { key: "dnsAccess", label: "DNS Settings Access?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "hasAnalytics", label: "Google Analytics Installed?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "hasSearchConsole", label: "Google Search Console?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "needsAccessHelp", label: "Need Help Recovering or Organizing Account Access?", type: "radios", options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Integrations",
          fields: [
            { key: "integrationsNeeded", label: "Which Integrations Might Be Needed?", type: "checks",
              options: ["Ticket links", "Bandsintown", "Songkick", "Shopify", "WooCommerce", "Square", "Stripe", "PayPal", "Mailchimp",
                "Klaviyo", "Google Analytics", "Meta Pixel", "TikTok Pixel", "YouTube", "Spotify", "Apple Music", "Instagram", "TikTok", "Discord", "Other"] },
            { key: "requiredIntegrations", label: "Any Required Integrations or Platforms?", type: "textarea", rows: 2, placeholder: "List any must-have integrations and whether you have existing accounts…" },
          ],
        },
      ],
    },
    // ── Step 9 ───────────────────────────────────────────────
    {
      title: "Timeline & Budget",
      description: "Timeline, budget, and final notes.",
      sections: [
        {
          heading: "Admin & Management",
          fields: [
            { key: "siteUpdater", label: "Who Will Update the Website After Launch?", type: "radios", cols: 1,
              options: ["Artist/team", "Manager", "Booking agent", "SeedTech", "Not sure"] },
            { key: "teamCanUpdate", label: "What Should Your Team Be Able to Update Without Contacting SeedTech?", type: "checks",
              options: ["Tour dates", "Merch products", "Photos", "Videos", "Blog/news posts", "Homepage announcements",
                "Fan vote/request results", "Email signup forms", "Contact information", "Other"] },
            { key: "teamComfort", label: "How Comfortable Is Your Team with Managing Website Content?", type: "radios", cols: 1, half: true,
              options: ["Very comfortable", "Somewhat comfortable", "Not comfortable", "We want SeedTech to handle most updates"] },
            { key: "recordedHandoff", label: "Recorded Handoff / Training Walkthrough?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Timeline",
          fields: [
            { key: "targetLaunchDate", label: "Target Launch Date", type: "date", half: true },
            { key: "launchDateReason", label: "Why Is That Date Important?", type: "checks", half: true,
              options: ["Tour announcement", "Album/single release", "Merch drop", "Press campaign", "Upcoming show", "Manager/label deadline", "No specific reason", "Other"] },
            { key: "urgency", label: "How Urgent Is This Project?", type: "radios",
              options: ["ASAP", "Within 2–4 weeks", "Within 1–2 months", "Flexible", "Researching options"] },
            { key: "immovableDeadlines", label: "Any Immovable Deadlines?", type: "textarea", rows: 2, placeholder: "Describe any hard deadlines and why they can't move…" },
          ],
        },
        {
          heading: "Budget & Scope",
          fields: [
            { key: "budgetRange", label: "Budget Range", type: "radios", cols: 1,
              options: ["Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000–$20,000", "$20,000+", "Not sure yet"] },
            { key: "priorityMatter", label: "What Matters Most Right Now?", type: "radios", cols: 1,
              options: ["Launching quickly", "Keeping the project affordable", "Building something highly custom",
                "Creating a premium/professional brand presence", "Merch/ecommerce", "Fan voting/request-a-show functionality", "Long-term scalability"] },
            { key: "openToPhased", label: "Open to Phased Development?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "phasedFirst", label: "If Phased, Which Should Come First?", type: "checks",
              showIf: (d) => d.openToPhased !== "No",
              options: ["Basic website", "Tour dates", "Request-a-show/voting", "Merch store", "Social embeds", "Email capture", "Admin dashboard", "Other"] },
          ],
        },
        {
          heading: "Ongoing Support",
          fields: [
            { key: "wantsOngoingSupport", label: "Want Ongoing Website Support After Launch?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "supportTypes", label: "What Type of Support Would Be Helpful?", type: "checks",
              options: ["Website updates", "Tour date updates", "Merch/product updates", "Security updates", "Hosting support",
                "Analytics/reporting", "SEO/content support", "Email list support", "New feature development", "Other"] },
            { key: "updateFrequency", label: "How Often Do You Expect Website Updates?", type: "radios",
              options: ["Weekly", "Monthly", "A few times per year", "Only during tour cycles", "Not sure"] },
          ],
        },
        {
          heading: "Final Notes",
          fields: [
            { key: "additionalNotes", label: "Is There Anything Else We Should Know?", type: "textarea", rows: 3, placeholder: "Any other context, constraints, or details that would help us…" },
            { key: "concerns", label: "Any Specific Concerns, Risks, or Must-Not-Miss Details?", type: "textarea", rows: 2, placeholder: "Things you've had problems with before, sensitivities, critical requirements…" },
            { key: "hearAboutUs", label: "How Did You Hear About SeedTech?", type: "select",
              options: ["Referral", "Existing client", "Google", "Social media", "Saw SeedTech's work", "Artist/manager referral", "Other"] },
          ],
        },
      ],
    },
  ],
};
