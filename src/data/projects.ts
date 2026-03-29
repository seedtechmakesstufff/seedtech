export type Department = "web-development" | "it-support";

export interface Project {
  slug: string;
  department: Department;
  client: string;
  title: string;
  tagline: string;
  description: string;
  url?: string;
  image?: string;
  /** Optional Vimeo or YouTube embed URL to show in the Screenshots section */
  videoUrl?: string;
  techStack: string[];
  tags: string[];
  highlights: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  /* ── Web Development ─────────────────────────────────── */
  {
    slug: "paddlers-cove",
    department: "web-development",
    client: "PaddlersCove",
    title: "BigCommerce Storefront & Custom Inventory Platform",
    tagline: "A fully custom ecommerce experience with a proprietary inventory management system syncing BigCommerce and Square in real time.",
    description:
      "PaddlersCove is a specialty kayak retailer that needed far more than an off-the-shelf storefront. We built a heavily customized BigCommerce storefront on Stencil with a unique UX tailored to high-consideration outdoor equipment. Beyond the store, we engineered a custom product and inventory management platform built on Next.js that integrates both Square POS and BigCommerce via API — giving the team a single source of truth for stock levels, pricing, and orders across all channels.",
    url: "https://paddlerscove.com",
    image: "/img/use_case_card_paddlerscove_1x.webp",
    techStack: ["BigCommerce", "Stencil", "Next.js", "Square API", "Vercel", "REST APIs"],
    tags: ["Ecommerce", "Custom Platform", "API Integration", "Inventory Management"],
    highlights: [
      "Custom Stencil storefront with brand-specific UX patterns",
      "Proprietary inventory platform built on Next.js + Vercel",
      "Real-time sync between BigCommerce and Square POS",
      "Automated product updates eliminating manual data entry",
      "Mobile-optimized storefront increasing mobile conversions",
    ],
    featured: true,
  },
  {
    slug: "short-run-custom-boxes",
    department: "web-development",
    client: "Drew & Rogers / Short Run Custom Boxes",
    title: "Custom Packaging Ecommerce Website",
    tagline: "A full-featured ecommerce site for a specialty custom packaging manufacturer, designed for complex product configuration.",
    description:
      "Short Run Custom Boxes required a sophisticated ecommerce presence that could handle highly configurable custom packaging orders. We designed and built a modern, conversion-focused site allowing customers to specify dimensions, materials, quantities, and print options — all feeding into a streamlined quote and order workflow.",
    url: "https://www.shortruncustomboxes.com",
    image: "/img/use_case_card_shortruncustomboxes_1x.webp",
    techStack: ["WordPress", "WooCommerce", "Custom Plugins", "PHP", "JavaScript"],
    tags: ["Ecommerce", "Custom Configuration", "WordPress", "Manufacturing"],
    highlights: [
      "Complex product configurator for custom packaging specs",
      "Streamlined quote-to-order workflow reducing friction",
      "Custom WordPress plugins for manufacturing-specific logic",
      "SEO-optimized architecture for niche packaging keywords",
    ],
    featured: true,
  },
  {
    slug: "bright-imaginations",
    department: "web-development",
    client: "Bright Imaginations Prep",
    title: "Custom WordPress Website for Private School",
    tagline: "A fully custom WordPress build with a bespoke calendar feature for a growing private schooling institution.",
    description:
      "Bright Imaginations Prep was on an older platform that couldn't keep pace with their growing enrollment and evolving needs. The UI felt dated and wasn't competitive with other institutions in the space. We delivered a fully custom WordPress site with a modern, admin-friendly design that the team can manage day-to-day without developer involvement. A standout feature is the custom-built calendar system, giving parents and staff a clear, interactive view of school events, enrollment deadlines, and schedules.",
    url: "https://brightimaginationsprep.com",
    image: "/img/use_case_card_bright_imaginations_1x.webp",
    techStack: ["WordPress", "Custom Theme", "PHP", "JavaScript", "Custom Calendar"],
    tags: ["WordPress", "Education", "Custom Features", "UI Overhaul"],
    highlights: [
      "Full platform migration from legacy system to WordPress",
      "Modern UI redesign to stay competitive in the private school market",
      "Custom-built interactive calendar feature for events and scheduling",
      "Admin-friendly CMS allowing staff to manage content independently",
      "Performance-optimized for fast page loads across devices",
    ],
    featured: true,
  },
  {
    slug: "starcom-fiber",
    department: "web-development",
    client: "StarCom Fiber",
    title: "Complete Website Overhaul for Fiber Telecom Provider",
    tagline: "A full website overhaul with GSAP-powered animations for one of New Jersey's leading fiber telecommunications companies.",
    description:
      "StarCom Fiber is a large fiber telecommunications company based in New Jersey with offices in Florida. They needed a complete website overhaul and facelift to better represent their position as an industry leader. We built a fully custom WordPress site leveraging the GSAP animation library to create a polished, modern experience that sets them apart from competitors in the telecom space.",
    url: "https://starcomfiber.com",
    image: "/img/use_case_card_starcom_1x.webp",
    techStack: ["WordPress", "Custom Theme", "GSAP", "PHP", "JavaScript", "CSS"],
    tags: ["WordPress", "Telecommunications", "GSAP Animations", "Website Overhaul"],
    highlights: [
      "Complete website overhaul and rebrand",
      "GSAP-powered animations creating a premium, modern feel",
      "Service plan comparison and coverage area tooling",
      "Designed to position StarCom as an industry leader in fiber",
      "Responsive design optimized for residential and business customers",
    ],
    featured: true,
  },
  {
    slug: "megasafe",
    department: "web-development",
    client: "Megasafe",
    title: "Custom WooCommerce Store & Product Management App",
    tagline: "A fully re-engineered WooCommerce store with a custom quote plugin and a proprietary Next.js product management app.",
    description:
      "Megasafe needed a complete ecommerce overhaul — their existing site was unusable and couldn't scale. We re-engineered the entire platform on WordPress + WooCommerce with a fully custom theme and bespoke plugin implementations. A custom-built quote plugin lets customers easily submit product quotes directly on the site. We migrated their entire inventory catalog from the old platform to WordPress, giving the team full control over products and day-to-day operations. Beyond the store, we built a fully custom product management app on Next.js, Vercel, and Neon with REST APIs that ties directly into the website. The app lets the team create and manage products, take photos using the native camera with built-in image guides for perfect product shots, and receive instant notifications when new quotes are submitted through the website's quote plugin.",
    url: "https://megasafe.com",
    image: "/img/use_case_card_megasafe_1x.webp",
    techStack: ["WordPress", "WooCommerce", "Custom Plugins", "Next.js", "Vercel", "Neon", "REST API", "PHP"],
    tags: ["Ecommerce", "WordPress", "Mobile App", "Custom Plugins", "Platform Migration"],
    highlights: [
      "Full platform migration from legacy site to WooCommerce",
      "Custom quote plugin for streamlined product quoting",
      "Entire inventory catalog migrated and restructured",
      "Proprietary Next.js app with native camera and image guides",
      "Real-time quote notifications synced between site and app",
      "Custom admin workflows giving the team full product control",
    ],
    featured: true,
  },
  {
    slug: "imperia-nj",
    department: "web-development",
    client: "Imperia",
    title: "Custom WordPress Website with GSAP Animations",
    tagline: "A stunning, animation-rich WordPress build for a premier New Jersey wedding and event venue.",
    description:
      "Imperia is a premier wedding and event venue in New Jersey that wanted to modernize their online presence to match the elegance of their physical space. We built a fully custom WordPress site featuring rich GSAP-powered animations that create a sophisticated, immersive browsing experience. The result is a modern, visually striking site that appeals to couples and event planners looking for a high-end venue.",
    url: "https://imperianj.com",
    image: "/img/use_case_card_imperia_1x.webp",
    techStack: ["WordPress", "Custom Theme", "GSAP", "PHP", "JavaScript", "CSS"],
    tags: ["WordPress", "GSAP Animations", "Events & Hospitality", "Custom Theme"],
    highlights: [
      "Fully custom WordPress theme with premium design",
      "GSAP animation library for smooth, engaging interactions",
      "Modern UI overhaul reflecting the venue's upscale brand",
      "Optimized for mobile to capture on-the-go event planners",
      "SEO-structured for local wedding and event venue searches",
    ],
    featured: true,
  },
  {
    slug: "trevor-noah-back-to-abnormal",
    department: "web-development",
    client: "Trevor Noah — Back to Abnormal Tour",
    title: "Custom Tour Platform with Interactive Voting Map",
    tagline: "A comprehensive custom-built platform for Trevor Noah's global tour — featuring ticketing, an interactive voting map, and a full backend management system.",
    description:
      "This was an extremely comprehensive custom-built platform for Trevor Noah's Back to Abnormal world tour. The platform allowed fans to purchase tickets, vote for Trevor to tour their country, and explore a fully custom interactive map interface where users could hover over their country and cast a vote. A real-time tally displayed the top 10 most-voted countries, giving management teams direct insight into new potential markets to add to the tour. The platform included a massive backend system to manage tours, presale codes, votes, and customer engagement — all built on Next.js and deployed on Google Cloud servers.",
    image: "/img/use_case_card_trevor_noah_1x.webp",
    videoUrl: "https://player.vimeo.com/video/1173486304?autoplay=1&loop=1&muted=1&controls=0&background=1",
    techStack: ["Next.js", "Google Cloud", "Node.js", "REST APIs", "Interactive Maps", "Real-time Data"],
    tags: ["Entertainment", "Custom Platform", "Interactive Map", "Tour Management"],
    highlights: [
      "Custom interactive world map with country-level hover and voting",
      "Real-time top-10 leaderboard of most-voted countries",
      "Full ticketing and presale code management system",
      "Comprehensive backend for tour, presale, and customer management",
      "Built on Next.js and Google Cloud for global scale",
      "Data-driven market discovery for tour expansion decisions",
    ],
    featured: true,
  },
  {
    slug: "ron-white-tatersalad",
    department: "web-development",
    client: "Ron White / TaterSalad.com",
    title: "Complete Website Overhaul with Custom Presale System",
    tagline: "A full architecture overhaul for Ron White's official site — featuring custom presale code capabilities, interactive tour maps, and streamlined admin workflows.",
    description:
      "The Ron White team was experiencing a highly unreliable and clunky website causing major disruptions to their operations. We overhauled the entire architecture on WordPress, dramatically improving functionality, speed, and optimized workflows for admin users to better manage tours, shows, and content. A standout feature is the fully custom presale code system, allowing management to dynamically set presale codes by tour or by individual show — giving fans early access to purchase tickets. We also augmented the interactive tour map, enabling multi-show cards to appear per city so fans can easily browse all available tours and shows in their area.",
    url: "https://tatersalad.com",
    image: "/img/use_case_card_ron_white.webp",
    techStack: ["WordPress", "Custom Plugins", "PHP", "JavaScript", "Interactive Maps", "WooCommerce"],
    tags: ["Entertainment", "WordPress", "Custom Presale", "Tour Management"],
    highlights: [
      "Complete architecture overhaul resolving reliability issues",
      "Custom presale code system — dynamic codes by tour or show",
      "Interactive tour map with multi-show cards per city",
      "Streamlined admin workflows for tour and show management",
      "Significant performance and speed improvements",
      "Mobile-optimized for fans browsing on the go",
    ],
    featured: true,
  },
  {
    slug: "bioox",
    department: "web-development",
    client: "BioOx",
    title: "Custom WooCommerce Store for Biological Science Products",
    tagline: "A fully custom WooCommerce build with bespoke features for a biological science company selling oxygen-enriched water, air scrubbing systems, and plant growth solutions.",
    description:
      "BioOx is a biological science company pioneering ROX-based (Reserve Oxygen) technology across water, air, and soil applications. They needed an ecommerce platform that could sell highly specialized products — BioOxygen Water, the Reactor 85 MK II air scrubber, and BioOx Grow — while clearly communicating complex science to both consumer and commercial audiences. We built a fully custom WooCommerce store with tailored product pages, use-case-driven navigation for verticals like clinics, equestrian, aquatics, and agriculture, an affiliate registration system, and investor relations integration. The result is a conversion-focused platform that bridges hard science with accessible buying experiences.",
    url: "https://www.bioox.us",
    image: "/img/use_case_card_bioox.webp",
    techStack: ["WordPress", "WooCommerce", "Elementor", "Custom Features", "PHP", "JavaScript"],
    tags: ["Ecommerce", "Science & Biotech", "WooCommerce", "Custom Features"],
    highlights: [
      "Custom WooCommerce store for complex biological science products",
      "Use-case-driven navigation spanning clinics, equestrian, agriculture, and aquatics",
      "Tailored product pages communicating ROX science to consumer and commercial buyers",
      "Built-in affiliate registration and management system",
      "Investor relations section integrated directly into the platform",
      "Mobile-optimized storefront for a science-first buying experience",
    ],
    featured: true,
  },

  /* ── IT Support ──────────────────────────────────────── */
  {
    slug: "eastside-bulk",
    department: "it-support",
    client: "Eastside Bulk",
    title: "Managed IT & Infrastructure for a Growing Trucking Operation",
    tagline: "From zero IT infrastructure to fully managed endpoints, server, and cloud — SeedTech built the foundation Eastside Bulk runs on.",
    description:
      "Eastside Bulk is a family-owned bulk trucking and material wholesale company headquartered in Lake Hopatcong, NJ. Since 2015, they've grown into a multi-state operation with hundreds of trucks and trailers across the Tri-State Area, offices in New Jersey, Maryland, and Pennsylvania, and a fleet of drivers moving everything from construction aggregates and decorative stone to salt and hazardous dry-bulk materials — guaranteeing 48-hour delivery across the East Coast.\n\nSeedTech has been Eastside Bulk's IT partner since the very beginning — one of our first and longest-standing clients. We built and continue to maintain the technology backbone that keeps their office operations running — from their on-site server and Windows workstation fleet to Microsoft 365, WiFi infrastructure, and ongoing proactive support.\n\nWhat started as a business with no IT support, no backups, and no infrastructure is now a stable, well-managed environment with full endpoint coverage, automated disaster recovery, and a reliable backup strategy that has already saved the business from critical data loss more than once.",
    url: "https://eastsidebulk.com",
    techStack: ["NinjaOne", "Microsoft 365", "HPE Aruba", "Windows Server", "QuickBooks"],
    tags: ["IT Support", "Managed Services", "Microsoft 365", "Networking", "Server", "Backup & Recovery"],
    highlights: [
      "One of SeedTech's original clients — a partnership active since 2017",
      "Built the entire IT environment from scratch with no prior infrastructure in place",
      "Automated server recovery eliminates manual intervention after every power outage",
      "Multiple QuickBooks recoveries performed, protecting critical financial data from permanent loss",
      "Nearly a decade of proactive IT management with no gaps in coverage",
      "WiFi upgraded to HPE Aruba for cloud-managed visibility and remote alerting",
    ],
    featured: true,
  },
  {
    slug: "south-shore-marine",
    department: "it-support",
    client: "South Shore Marine",
    title: "Managed IT for a Lake Hopatcong Boat Repair Shop",
    tagline: "SeedTech gave a growing marine service business the technology foundation to run lean, stay connected, and focus on what they do best — fixing boats.",
    description:
      "South Shore Marine is a boat service and repair company founded by marine industry veterans Mike and Jimmy, with over 40 years of combined experience between them. Located in Stanhope, NJ just a mile from Lake Hopatcong State Park, they've built a reputation as the lake's trusted repair shop — offering everything from routine maintenance and major repairs to a one-of-a-kind concierge service that handles launching, delivering, and managing boats on behalf of their customers.\n\nWhen they came to SeedTech, they had no IT infrastructure, no managed support, and no real technology foundation in place. For a business built on scheduling, customer communication, and keeping a busy service operation organized, that exposure adds up fast.\n\nSeedTech stepped in as their dedicated IT partner, putting the right tools in place and keeping everything running so Mike and Jimmy can stay focused on the water — not on their computers.",
    url: "https://southshoremarineofnj.com",
    techStack: ["NinjaOne", "Google Workspace", "SentinelOne", "HPE Aruba"],
    tags: ["IT Support", "Managed Services", "Google Workspace", "Networking"],
    highlights: [
      "Built the entire IT environment from scratch with no prior infrastructure in place",
      "Google Workspace deployed as a clean, cloud-first communication and collaboration platform",
      "SentinelOne AI-driven security protecting all endpoints from day one",
      "24/7 proactive monitoring ensuring issues are caught before they become problems",
      "Unlimited business-hours helpdesk giving the team a real person to call when they need one",
      "A technology foundation that scales as South Shore Marine continues to grow",
    ],
    featured: true,
  },
  {
    slug: "west-shore-marine",
    department: "it-support",
    client: "West Shore Marine",
    title: "IT Buildout for a Marina Expansion on Lake Hopatcong",
    tagline: "When the owners of South Shore Marine acquired a second location on the water, SeedTech handled everything — new infrastructure, phones, internet, and a seamless transition from day one.",
    description:
      "West Shore Marine is a full-service marina on Lake Hopatcong, NJ — offering boat sales and service, dock slips, a ship shop, towing, and Wave Armor floating dock systems. It's operated by the same ownership team behind South Shore Marine, who acquired this larger waterfront location as a natural expansion of their growing marine business.\n\nWhen the purchase went through, the owners turned to SeedTech to get the new location stood up from a technology standpoint — fast. That meant new internet service, new hardware, a business phone system with a menu and call routing, and carrying over the previous owner's phone number so customers could reach them without interruption. SeedTech coordinated every piece of it.\n\nThe result was a fully operational IT environment ready to support a busy marina from opening day — no dropped calls, no lost numbers, no scrambling.",
    url: "https://westshoremarineofnj.com",
    techStack: ["NinjaOne", "Google Workspace", "Dialpad", "SentinelOne", "Optimum Business"],
    tags: ["IT Support", "Managed Services", "Google Workspace", "VoIP", "Networking"],
    highlights: [
      "Full technology buildout completed for a new marina location under real acquisition pressure",
      "ISP coordination handled end-to-end by SeedTech — one less thing for the owners to manage",
      "Previous owner's phone number successfully ported to Dialpad with zero customer disruption",
      "Custom call menu and routing configured for a professional phone presence from day one",
      "Shop laptop deployed and configured specifically for ECU diagnostics and boat computer work",
      "Both marina locations unified on Google Workspace under a single managed environment",
    ],
    featured: true,
  },
  {
    slug: "bagels-on-the-hill",
    department: "it-support",
    client: "Bagels on the Hill",
    title: "A Full Technology Partnership for a Local Bagel Institution",
    tagline: "From a custom website and Square POS integration to in-store digital signage and managed IT — SeedTech handles the technology so Bagels on the Hill can focus on the bagels.",
    description:
      "Bagels on the Hill is a family-owned bagel shop in Landing, NJ that's been serving the community since 1991. Open as early as 5am, they run a high-volume, fast-paced operation — fresh bagels every morning, a full breakfast and lunch menu, and a loyal local following that keeps the line moving from the moment the doors open.\n\nWhen they came to SeedTech, they had no technology infrastructure to speak of. No managed support, no proper POS setup, and no real digital presence. For a business that moves as fast as a bagel shop at 6am, the wrong tech — or no tech — is a real problem.\n\nSeedTech became their full technology partner, handling everything from a custom website with Square POS integration and professional photography and video, to in-store digital menu displays and ongoing managed support for their point-of-sale environment. It's not a typical IT engagement — it's a complete technology relationship built around how a food service business actually operates.",
    url: "https://bagelsonthehillnj.com",
    techStack: ["Square POS", "NinjaOne", "Optimum Business", "Digital Signage"],
    tags: ["IT Support", "Web Development", "POS Integration", "Digital Signage", "Networking"],
    highlights: [
      "Full technology buildout for a food service business — website, POS, signage, and network under one partner",
      "Custom website integrated directly with Square POS for seamless online and in-person order management",
      "Digital menu signage installed in-store, replacing printed boards with an easy-to-update display system",
      "Professional photography and video produced on-site by SeedTech's team",
      "ISP coordination and ongoing network management keeping the POS environment stable and connected",
      "One technology partner handling every layer — no vendor juggling for the ownership team",
    ],
    featured: true,
  },
  {
    slug: "megasafe-it",
    department: "it-support",
    client: "Megasafe",
    title: "Managed IT & Microsoft 365 for a High-Security Safe & Vault Company",
    tagline: "Megasafe protects what matters most for jewelers, banks, and businesses across the country. SeedTech makes sure their own technology is held to the same standard.",
    description:
      "Megasafe is a high-security safe and vault company based in Netcong, NJ. They sell, install, move, and service some of the most sophisticated physical security products available — UL-rated safes, custom vaults, pharmaceutical-grade storage, banking equipment — and their clients include jewelers, financial institutions, cannabis operators, and other businesses where protecting physical assets isn't optional. They operate on a reputation built over years of doing meticulous, high-stakes work right.\n\nSeedTech's relationship with Megasafe runs deeper than managed IT — we also built and maintain their website. So when it came time to get their internal technology environment properly organized, it was a natural extension of an already trusted partnership. We migrated the team to Microsoft 365, brought their endpoints under managed support, and made sure the people who spend their days securing everyone else's valuables weren't leaving their own systems unmanaged.",
    url: "https://megasafe.com",
    techStack: ["NinjaOne", "Microsoft 365", "SentinelOne"],
    tags: ["IT Support", "Managed Services", "Microsoft 365", "Cloud Migration", "Web Development"],
    highlights: [
      "SeedTech serves as Megasafe's full technology partner — managing both their internal IT and their public website",
      "Microsoft 365 migration completed cleanly with no disruption to daily operations",
      "SentinelOne endpoint security deployed across the full environment from day one",
      "SeedCare Plus provides unlimited helpdesk and advisory — no ticket caps, no waiting",
      "24/7 proactive monitoring running continuously across all endpoints",
      "A business that holds its clients' physical security to a high standard now holds its own technology to the same one",
    ],
    featured: true,
  },
  {
    slug: "kelly-plumbing-heating",
    department: "it-support",
    client: "Kelly Plumbing & Heating",
    title: "Managed IT for a Morris County Plumbing & HVAC Business Since 1988",
    tagline: "Kelly Plumbing & Heating has been showing up for their customers for over 35 years. They needed an IT partner that shows up the same way.",
    description:
      "Kelly Plumbing & Heating is a family-owned plumbing, heating, and HVAC company serving Mendham, Morristown, Chester, and the surrounding Morris County area. They've been in business since 1988 — the kind of company that knows every customer by name and has spent decades earning a reputation for honest, reliable service.\n\nThey weren't without IT support when they came to SeedTech. But their previous provider wasn't keeping up. In a business where the day starts at 7am, technicians need to be dispatched, and customers expect a call back the same morning — a support partner with slow response times is a liability, not an asset. They made the switch to SeedTech, and the difference was immediate.\n\nSeedTech now manages their full IT environment under SeedCare Plus — monitoring continuously, responding quickly, and providing the kind of proactive, accountable support that a trades business running on tight margins and tighter schedules can actually depend on.",
    url: "https://kellyplumbingheating.com",
    techStack: ["NinjaOne", "Microsoft 365", "SentinelOne"],
    tags: ["IT Support", "Managed Services", "Microsoft 365"],
    highlights: [
      "Clean transition from a previous IT provider with no gap in service or coverage",
      "SeedCare Plus delivering unlimited helpdesk and advisory — the same responsiveness Kelly gives their own customers",
      "A business that starts at 7am now has IT monitoring that started even earlier",
      "SentinelOne security deployed across the full environment from day one",
      "Microsoft 365 properly configured for a team that runs on scheduling, estimates, and job coordination",
      "24/7 proactive monitoring replacing the reactive, wait-and-see approach of the previous arrangement",
    ],
    featured: true,
  },
  {
    slug: "hiler-contracting",
    department: "it-support",
    client: "Hiler Contracting",
    title: "From Break-Fix to Proactive IT for a New Jersey Contracting Operation",
    tagline: "Hiler Contracting runs a demanding operation — heavy schedules, physical work, and an office that needs to keep up with all of it. SeedTech replaced their informal tech arrangement with IT support that's actually built for that.",
    description:
      "Hiler Contracting is a contracting company based in New Jersey — the kind of operation where the work is physical, the schedules are tight, and office efficiency has a direct impact on field performance. Before SeedTech, their IT was held together by a personal relationship with someone who could help when available. It wasn't a managed arrangement, there was no SLA, and there were no backups or monitoring in place.\n\nThat kind of setup works until it doesn't. SeedTech came in, assessed the environment, and replaced the informal break-fix arrangement with a structured managed IT foundation under SeedCare Essentials. Endpoints under management, endpoint security deployed, Microsoft 365 set up for the team, and file-level backup running automatically for the first time.\n\nHiler Contracting now has an IT partner with accountability behind it — not just a favor.",
    techStack: ["NinjaOne", "Microsoft 365", "SentinelOne"],
    tags: ["IT Support", "Managed Services", "Microsoft 365", "Backup & Recovery"],
    highlights: [
      "Replaced a break-fix arrangement with a structured, proactive managed IT environment",
      "File-level backup deployed for the first time — automated, cloud-based, with monthly reporting",
      "SentinelOne endpoint security running across every machine from day one",
      "Microsoft 365 giving the team a professional communication and document platform",
      "24/7 monitoring replacing the reactive, availability-dependent support they'd relied on before",
      "An IT partner that's accountable to an SLA — not just a contact in someone's phone",
    ],
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByDepartment(dept: Department): Project[] {
  return projects.filter((p) => p.department === dept);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export const departmentLabels: Record<Department, string> = {
  "web-development": "Web Development",
  "it-support": "IT Support",
};
