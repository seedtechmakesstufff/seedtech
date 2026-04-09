import { PrismaClient, KeywordTier, KeywordIntent } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const p = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });

const SITE = 'site_seedtech';

const keywords = [
  // LA WEB DEV
  { keyword: 'web developers los angeles', tier: 'tier1', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'website developers los angeles', tier: 'tier1', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web development los angeles', tier: 'tier1', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web development agency los angeles', tier: 'tier1', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'website development los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web development company los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'website development company los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web developer los angeles ca', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web design company los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'ecommerce web development los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'custom web development los angeles', tier: 'tier2', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'los angeles web agency', tier: 'tier3', intent: 'transactional', targetPage: '/locations/la-web-design' },
  { keyword: 'web development services los angeles', tier: 'tier3', intent: 'transactional', targetPage: '/locations/la-web-design' },
  // NYC WEB DEV
  { keyword: 'web design company NYC', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web development company NYC', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'website developers NYC', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web development NYC', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web development agency NYC', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'website development company NYC', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web design agency New York', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'ecommerce web development NYC', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'custom web development NYC', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web developer New York', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'web app development NYC', tier: 'tier3', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  { keyword: 'corporate website design NYC', tier: 'tier3', intent: 'transactional', targetPage: '/locations/nyc-web-design' },
  // NJ WEB DEV (new non-duplicate)
  { keyword: 'web design company in new jersey', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'website development company new jersey', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'website development company nj', tier: 'tier1', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'new jersey web development', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'new jersey website development', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'nj website developer', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'web development services new jersey', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'web development services nj', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'website development in new jersey', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'web design agency NJ', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'website redesign NJ', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'ecommerce website development new jersey', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  { keyword: 'business website design NJ', tier: 'tier2', intent: 'transactional', targetPage: '/locations/nj-web-design' },
  // NATIONAL HIGH-VOLUME
  { keyword: 'web design services', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'web development services', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'web design and development company', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'ecommerce development company', tier: 'tier1', intent: 'transactional', targetPage: '/services/ecommerce-development' },
  { keyword: 'ecommerce web development', tier: 'tier1', intent: 'transactional', targetPage: '/services/ecommerce-development' },
  { keyword: 'ecommerce web design company', tier: 'tier2', intent: 'transactional', targetPage: '/services/ecommerce-development' },
  { keyword: 'custom web development', tier: 'tier1', intent: 'transactional', targetPage: '/services/custom-development' },
  { keyword: 'custom web design agency', tier: 'tier1', intent: 'transactional', targetPage: '/services/custom-development' },
  { keyword: 'custom web app development', tier: 'tier2', intent: 'transactional', targetPage: '/services/custom-development' },
  { keyword: 'web app development', tier: 'tier1', intent: 'transactional', targetPage: '/services/custom-development' },
  { keyword: 'professional website developer', tier: 'tier2', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'website redesign agency', tier: 'tier2', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'business website design', tier: 'tier2', intent: 'transactional', targetPage: '/services/seedtech-platform' },
  { keyword: 'corporate website design', tier: 'tier2', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'web development company near me', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'web design companies near me', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'website designer near me', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'website developers near me', tier: 'tier1', intent: 'transactional', targetPage: '/services/web-development' },
  { keyword: 'ecommerce development services', tier: 'tier2', intent: 'transactional', targetPage: '/services/ecommerce-development' },
  { keyword: 'custom website development company', tier: 'tier2', intent: 'transactional', targetPage: '/services/custom-development' },
  { keyword: 'web development agency near me', tier: 'tier2', intent: 'transactional', targetPage: '/services/web-development' },
];

(async () => {
  const existing = await p.trackedKeyword.findMany({ where: { siteId: SITE }, select: { keyword: true } });
  const existingSet = new Set(existing.map(k => k.keyword.toLowerCase()));
  const toInsert = keywords.filter(k => !existingSet.has(k.keyword.toLowerCase()));
  const dupes = keywords.filter(k => existingSet.has(k.keyword.toLowerCase()));
  console.log('Existing keywords:', existing.length);
  console.log('New keywords to insert:', toInsert.length);
  console.log('Duplicates skipped:', dupes.length);
  dupes.forEach(d => console.log('  SKIP:', d.keyword));
  if (toInsert.length === 0) { console.log('Nothing to insert.'); await p.$disconnect(); return; }
  const result = await p.trackedKeyword.createMany({
    data: toInsert.map(k => ({ siteId: SITE, keyword: k.keyword, tier: k.tier as KeywordTier, intent: k.intent as KeywordIntent, targetPage: k.targetPage })),
    skipDuplicates: true,
  });
  console.log('Inserted:', result.count);
  const total = await p.trackedKeyword.count({ where: { siteId: SITE } });
  console.log('Total tracked keywords now:', total);
  await p.$disconnect();
})();
