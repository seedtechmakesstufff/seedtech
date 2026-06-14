import type { IntakeConfig } from "./types";

/* ── Comedian & Live Comedy Website intake ──
 * Parallel to the Artist intake but tailored to stand-ups, improv/sketch
 * groups, podcast hosts, and touring comedians (clips & specials instead of
 * music; club/college/corporate booking; comedy-specific venues).
 */

export const COMEDIAN_INTAKE_CONFIG: IntakeConfig = {
  key: "comedian",
  source: "comedian_intake",
  serviceLabel: "Comedian Website Intake",
  endpoint: "/api/comedian-intake",
  recaptchaAction: "comedian_intake",
  leadSource: "comedian_intake",
  entityNameKey: "comedianName",
  entityTitle: "Comedian",
  formName: "Comedian & Live Comedy Website",
  notifyEmoji: "🎤",
  emailTags: "Web Development · Comedian Website · Entertainment · Live Comedy · Intake Submitted",
  steps: [
    // ── Step 1 ───────────────────────────────────────────────
    {
      title: "About You",
      description: "Who's filling out this form?",
      sections: [
        {
          fields: [
            { key: "contactName", label: "Contact Name *", type: "text", placeholder: "Your full name", half: true, required: true },
            { key: "contactRole", label: "Role / Relationship to the Act", type: "select", half: true,
              options: ["Comedian / performer", "Group member", "Manager", "Agent / booker", "Publicist", "Tour manager", "Producer", "Other"] },
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
      title: "Your Act",
      description: "Tell us about the act and your current setup.",
      sections: [
        {
          fields: [
            { key: "comedianName", label: "Comedian / Act Name *", type: "text", placeholder: "Stage name or group name", half: true, required: true },
            { key: "actType", label: "Type of Act", type: "select", half: true,
              options: ["Solo stand-up", "Comedy duo", "Improv troupe", "Sketch group", "Musical comedy", "Podcast / host", "Variety / multi-format", "Other"] },
            { key: "comedyStyle", label: "Comedy Style", type: "checks",
              options: ["Observational", "Storytelling", "Crowd work", "Clean / corporate", "Dark", "Political / topical", "Improv",
                "Sketch", "Musical", "Roast", "Character", "Family-friendly", "Other"] },
            { key: "actLocation", label: "Where is the Act Based?", type: "text", placeholder: "City / State / Country" },
            { key: "actDescription", label: "Describe the Act", type: "textarea", rows: 4, placeholder: "Tell us about the act…",
              hint: "Style, history, audience, current momentum, notable rooms/festivals, comparable comedians — anything that helps us understand the brand." },
            { key: "currentWebsite", label: "Current Website URL", type: "text", placeholder: "https://yourname.com", hint: "Leave blank if you don't have one." },
            { key: "ownsDomain", label: "Do you own your domain name?", type: "radios", options: ["Yes", "No", "Not sure"] },
            { key: "domainName", label: "Domain Name", type: "text", placeholder: "yourname.com", hint: "e.g. yourname.com", half: true },
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
              options: ["Promote upcoming shows/tour dates", "Sell tickets", "Get booked (clubs / colleges / corporate)",
                "Help fans request/vote for future cities", "Sell merchandise", "Showcase clips & specials", "Promote a podcast",
                "Build an email/text fan list", "Display social media content", "Provide a press kit / EPK",
                "Replace an outdated website", "Create a more professional presence", "Other"] },
            { key: "successCriteria", label: "What Would Make This Project Successful?", type: "textarea", rows: 3, placeholder: "Describe what success looks like for you…" },
            { key: "websiteType", label: "Simple Website or Custom Platform?", type: "radios", cols: 1,
              options: ["Simple comedian website", "Website with tour dates and merch", "Website with ticketing + booking funnels",
                "Website with city-request/voting features", "Custom platform with backend management", "Not sure yet"] },
            { key: "pagesNeeded", label: "Which Pages Do You Want?", type: "checks",
              options: ["Home", "Tour Dates / Shows", "Tickets", "Request a Show / Vote for Your City", "Clips / Videos", "Specials",
                "Podcast", "Merch Store", "About / Bio", "Press Kit / EPK", "Booking", "Corporate / Private Events",
                "Contact", "Newsletter Signup", "Blog / News", "Other"] },
            { key: "needsEPK", label: "Do You Need an EPK / Booking One-Sheet?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "epkContents", label: "What Should Be Included in the EPK?", type: "checks",
              showIf: (d) => d.needsEPK === "Yes",
              options: ["Bio", "Headshots / promo photos", 'Credits ("as seen on")', "Best clips / sizzle reel", "Special(s)",
                "Festival history", "Notable press", "Technical rider", "Booking contact", "Downloadable one-sheet", "Other"] },
          ],
        },
      ],
    },
    // ── Step 4 ───────────────────────────────────────────────
    {
      title: "Show & Tour Dates",
      description: "How do you manage shows today?",
      sections: [
        {
          fields: [
            { key: "hasShows", label: "Do You Currently Have Upcoming Shows?", type: "radios", cols: 1,
              options: ["Yes", "No", "Some are confirmed, others are pending"] },
            { key: "showCount", label: "How Many Upcoming Shows Do You Need Listed?", type: "select",
              options: ["1–5", "6–15", "16–30", "31–50", "50+"] },
            { key: "tourManagement", label: "How Do You Currently Manage Show Dates?", type: "checks",
              options: ["Spreadsheet", "Eventbrite", "Comedy club calendars", "Ticketing platform", "Bandsintown", "Facebook Events",
                "Venue / club websites", "Manually on current website", "We do not have a system yet", "Other"] },
            { key: "tourDatePref", label: "Manual Entry or Platform Integration?", type: "radios", cols: 1,
              options: ["Manual entry is fine", "Prefer integration if possible", "Not sure"] },
            { key: "showDisplayInfo", label: "What Information Should Each Show Display?", type: "checks",
              options: ["Date", "Venue / club name", "City / state", "Doors time", "Show time", "Age restriction (18+/21+)",
                "Ticket link", "Two-item / drink minimum", "Supporting acts / lineup", "Venue address", "Map link",
                "Sold out label", "Low ticket warning", "Show poster / image", "Other"] },
            { key: "archivePastShows", label: "Archive Past Shows on the Website?", type: "radios", options: ["Yes", "No", "Maybe later"] },
          ],
        },
      ],
    },
    // ── Step 5 ───────────────────────────────────────────────
    {
      title: "Fan Requests",
      description: "Should fans be able to request cities and rooms?",
      sections: [
        {
          fields: [
            { key: "wantsFanRequest", label: "Do You Want Fans to Request Where You Should Perform?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "fanRequestTypes", label: "What Type of Request Feature Are You Interested In?", type: "checks",
              options: ["Fans vote for a city", "Fans suggest a comedy club", "Fans suggest a theater/room", "Fans request a college show",
                "Fans request a corporate/private event", "Fans request a fundraiser", "Fans enter contact info to measure interest", "Other"] },
            { key: "targetVenues", label: "What Type of Venues Are You Targeting?", type: "checks",
              options: ["Comedy clubs", "Bars / breweries", "Theaters", "Colleges", "Corporate events", "Private events",
                "Festivals", "Casinos", "Cruises", "Fundraisers", "Other"] },
            { key: "exampleVenues", label: "Example Venues or Target Venue Types", type: "textarea", rows: 3, placeholder: "Describe the type of rooms you're targeting…",
              hint: 'e.g. "Clubs like Caroline\'s or The Stand, plus colleges and corporate gigs."' },
            { key: "showVoteTotals", label: "Should Fans See Vote Totals Publicly?", type: "radios", cols: 1,
              options: ["Yes, show public vote totals", "Yes, but only show top cities/venues", "No, keep vote totals private", "Not sure"] },
            { key: "requireEmailVote", label: "Should Fan Voting Require an Email Address?", type: "radios", options: ["Yes", "No", "Optional", "Not sure"] },
            { key: "fanSubmitFields", label: "What Information Should Fans Submit When Requesting a City or Venue?", type: "checks",
              options: ["Name", "Email", "Phone", "City", "State", "Venue / club name", "Venue website", "Venue contact info",
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
      description: "Merch, clips, specials, podcast, and social.",
      sections: [
        {
          heading: "Merchandise",
          fields: [
            { key: "sellsMerch", label: "Do You Currently Sell Merchandise Online?", type: "radios", cols: 1, options: ["Yes", "No", "Not yet, but we want to"] },
            { key: "currentMerchPlatforms", label: "Where Do You Currently Sell Merch?", type: "checks",
              options: ["Shopify", "WooCommerce", "Square", "Big Cartel", "Etsy", "Bonfire", "Merch company / fulfillment provider",
                "In-person only", "We do not sell merch yet", "Other"] },
            { key: "merchTypes", label: "Types of Merch You Sell or Plan to Sell", type: "checks",
              options: ["T-shirts", "Hoodies", "Hats", "Stickers", "Posters", "Mugs", "Signed items", "Special/album downloads",
                "Bundles", "Limited drops", "Tour-exclusive items", "Other"] },
            { key: "launchProductCount", label: "Products at Launch", type: "select", half: true, options: ["1–5", "6–15", "16–30", "31–50", "50+"] },
            { key: "inventoryTracking", label: "Inventory Tracking?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "shippingTax", label: "Shipping / Tax Setup?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Not sure"] },
            { key: "fulfillmentMethod", label: "Who Will Fulfill Merch Orders?", type: "radios", cols: 1, half: true,
              options: ["Comedian/team", "Third-party merch company", "Print-on-demand provider", "Not sure yet"] },
            { key: "helpSelectPlatform", label: "Help Selecting an Ecommerce Platform?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Clips, Specials & Podcast",
          fields: [
            { key: "videoHosting", label: "Where Do Your Clips / Videos Live?", type: "checks", half: true,
              options: ["YouTube", "Instagram", "TikTok", "Facebook", "Vimeo", "X / Twitter", "Other"] },
            { key: "specialPlatforms", label: "Where Are Your Specials Available?", type: "checks", half: true,
              options: ["YouTube", "Netflix", "Amazon / Prime", "Hulu", "Dry Bar", "800 Pound Gorilla", "Self-hosted", "No special yet", "Other"] },
            { key: "clipLinks", label: "Clip / Special Links to Include on the Website", type: "textarea", rows: 2, placeholder: "List your best clips, sizzle reel, or special links…" },
            { key: "embeddedVideos", label: "Embed Clips / Videos on Site?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Maybe"] },
            { key: "hasPodcast", label: "Do You Have a Podcast?", type: "radios", cols: 1, half: true, options: ["Yes", "No", "Planning to"] },
            { key: "podcastPlatforms", label: "Podcast Platforms", type: "checks",
              showIf: (d) => d.hasPodcast === "Yes" || d.hasPodcast === "Planning to",
              options: ["Spotify", "Apple Podcasts", "YouTube", "Patreon", "Amazon Music", "Self-hosted", "Other"] },
            { key: "podcastEmbed", label: "Embed Podcast Episodes on Site?", type: "radios", cols: 1, half: true,
              showIf: (d) => d.hasPodcast === "Yes" || d.hasPodcast === "Planning to",
              options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Social Media",
          fields: [
            { key: "socialPlatforms", label: "Social Platforms to Link on Website", type: "checks",
              options: ["Instagram", "TikTok", "YouTube", "Facebook", "X / Twitter", "Threads", "Snapchat", "Patreon", "Twitch", "Discord", "Other"] },
            { key: "socialUrls", label: "Official Social Media URLs", type: "textarea", rows: 3, placeholder: "List all official social URLs, one per line…" },
            { key: "displaySocialPosts", label: "Display Recent Social Posts on Site?", type: "radios", cols: 1, half: true,
              options: ["Yes", "No, just social links", "Maybe, depending on cost/platform limitations"] },
            { key: "socialManager", label: "Who Manages Your Social Media?", type: "text", half: true, placeholder: "You, manager, agency…" },
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
              options: ["Mailchimp", "Klaviyo", "Constant Contact", "ConvertKit", "Substack", "Shopify Email", "None yet", "Other"] },
            { key: "fanSignup", label: "Should Fans Be Able to Sign Up for Updates?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "fanSignupFor", label: "What Can Fans Sign Up For?", type: "checks",
              options: ["Tour announcements", "Ticket presales", "Merch drops", "New clips / specials", "Podcast episodes",
                "Local show alerts", "VIP / meet-and-greet", "General newsletter", "Other"] },
            { key: "helpEmailPlatform", label: "Help Setting Up an Email Marketing Platform?", type: "radios", options: ["Yes", "No", "Maybe"] },
          ],
        },
        {
          heading: "Design & Branding",
          fields: [
            { key: "brandingAssets", label: "Branding Assets You Already Have", type: "checks",
              hint: "File uploads (logos, headshots, posters) can be sent separately — we'll follow up after you submit.",
              options: ["Logo", "Headshots", "Promo photos", "Show posters", "Fonts", "Color palette", "Brand guidelines", "We need help with this", "Other"] },
            { key: "designDescription", label: "Describe the Look and Feel You Want", type: "textarea", rows: 3, placeholder: "Describe the vibe, mood, and aesthetic you're going for…",
              hint: "e.g. bold, irreverent, clean, retro, dark, playful, premium, high-energy, minimalist…" },
            { key: "sitesLike", label: "List 2–5 Websites You Like", type: "textarea", rows: 3, placeholder: "https://example.com — love the tour date layout and clip reel…",
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
            { key: "comedianBio", label: "Comedian / Act Bio", type: "textarea", rows: 3, placeholder: "Paste your bio or key points…" },
            { key: "credits", label: 'Credits — TV, Festivals, "As Seen On"', type: "textarea", rows: 2, placeholder: "e.g. Tonight Show, JFL, Netflix, Comedy Central, podcasts…" },
            { key: "bookingCopy", label: "Booking / Contact Copy", type: "textarea", rows: 2, placeholder: "What should the booking contact section say?" },
            { key: "pressQuotes", label: "Press Quotes, Notable Rooms, or Accomplishments", type: "textarea", rows: 2, placeholder: "Any press quotes, notable venues, milestones…" },
            { key: "mustMention", label: "Anything That Must Be Mentioned?", type: "textarea", rows: 2, half: true, placeholder: "Critical info, upcoming special, tour sponsors…" },
            { key: "mustNotMention", label: "Anything That Should NOT Be Mentioned?", type: "textarea", rows: 2, half: true, placeholder: "Old material, past conflicts, retired bits…" },
          ],
        },
        {
          heading: "Booking & Contact",
          fields: [
            { key: "inquiriesGoTo", label: "Who Should Website Inquiries Go To?", type: "text", placeholder: "Name, email, or role…" },
            { key: "inquiryTypes", label: "Types of Inquiries the Site Should Support", type: "checks",
              options: ["Club booking", "College booking", "Corporate / private events", "Festival", "Fundraiser", "MC / host",
                "Press/media", "General fan contact", "Sponsorships", "Other"] },
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
              options: ["Ticket links", "Eventbrite", "Ticketmaster / Live Nation", "Shopify", "WooCommerce", "Square", "Stripe", "PayPal",
                "Mailchimp", "Klaviyo", "Patreon", "Podcast host (RSS)", "Google Analytics", "Meta Pixel", "TikTok Pixel",
                "YouTube", "Instagram", "TikTok", "Other"] },
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
              options: ["Comedian/team", "Manager", "Agent / booker", "SeedTech", "Not sure"] },
            { key: "teamCanUpdate", label: "What Should Your Team Be Able to Update Without Contacting SeedTech?", type: "checks",
              options: ["Tour dates", "Merch products", "Clips / videos", "Podcast episodes", "Blog/news posts", "Homepage announcements",
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
              options: ["Tour announcement", "Special release", "Festival", "Podcast launch", "Press campaign", "Upcoming show", "Manager/agent deadline", "No specific reason", "Other"] },
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
                "Creating a premium/professional brand presence", "Ticketing / booking funnels", "City-request/voting functionality", "Long-term scalability"] },
            { key: "openToPhased", label: "Open to Phased Development?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "phasedFirst", label: "If Phased, Which Should Come First?", type: "checks",
              showIf: (d) => d.openToPhased !== "No",
              options: ["Basic website", "Tour dates", "Ticketing", "City-request/voting", "Merch store", "Clips / specials", "Podcast", "Email capture", "Admin dashboard", "Other"] },
          ],
        },
        {
          heading: "Ongoing Support",
          fields: [
            { key: "wantsOngoingSupport", label: "Want Ongoing Website Support After Launch?", type: "radios", options: ["Yes", "No", "Maybe"] },
            { key: "supportTypes", label: "What Type of Support Would Be Helpful?", type: "checks",
              options: ["Website updates", "Tour date updates", "Merch/product updates", "Clip / special updates", "Podcast updates",
                "Security updates", "Hosting support", "Analytics/reporting", "SEO/content support", "Email list support", "New feature development", "Other"] },
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
              options: ["Referral", "Existing client", "Google", "Social media", "Saw SeedTech's work", "Manager/agent referral", "Other"] },
          ],
        },
      ],
    },
  ],
};
