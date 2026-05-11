/* ── Artifact Publishers ──
 * Wires concrete publish actions to artifact types. When an artifact is
 * approved in the Inbox, the publisher for its type runs. New artifact types
 * register their publisher here.
 */

import { registerPublisher } from "@/lib/agent-publisher-registry";
import { replyToGbpReview, createGbpLocalPost, validateGbpCtaUrl } from "@/lib/gbp";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPES, logEvent } from "@/lib/events";
import type { BlogDraftPayload } from "@/lib/agents/blog-drafter";
import type { GbpPostDraftPayload } from "@/lib/agents/gbp-post-drafter";
import { applyLinkSuggestions, type LinkSuggestionsPayload } from "@/lib/agents/internal-link-agent";
import type { KeywordCandidatePayload } from "@/lib/agents/keyword-scout";

interface ReviewReplyPayload {
  reviewName: string;     // "accounts/x/locations/y/reviews/z"
  reply: string;
  rating?: number;
  reviewerName?: string;
}

/* ── blog_draft → publish the BlogPost ── */
registerPublisher("blog_draft", async (artifact) => {
  const payload = artifact.payload as unknown as BlogDraftPayload;
  if (!payload?.blogPostId) throw new Error("blog_draft missing blogPostId");
  const post = await prisma.blogPost.update({
    where: { id: payload.blogPostId },
    data: { status: "published", publishedAt: new Date() },
  });
  await logEvent({
    siteId: artifact.siteId,
    type: EVENT_TYPES.CONTENT_PUBLISHED,
    title: `Published: ${post.title}`,
    payload: { slug: post.slug, title: post.title, targetKeyword: post.targetKeyword, via: "blog-drafter" },
    entityType: "BlogPost",
    entityId: post.id,
  });

  // Fire-and-forget: scan for internal-link opportunities now that this post exists
  void runInternalLinkAgentSafe(artifact.siteId, post.id);

  return { ok: true, result: { slug: post.slug } };
});

/** Wrapper that swallows errors so a link-agent failure never blocks publishing. */
async function runInternalLinkAgentSafe(siteId: string, postId: string) {
  try {
    const { runInternalLinkAgent } = await import("@/lib/agents/internal-link-agent");
    await runInternalLinkAgent(siteId, { mode: "post", postId });
  } catch (e) {
    console.error("[internal-link-agent] post-publish hook failed", e);
  }
}

/* ── gbp_post_draft → create a localPost on GBP ── */
registerPublisher("gbp_post_draft", async (artifact) => {
  const payload = artifact.payload as unknown as GbpPostDraftPayload;
  if (!payload?.locationResource || !payload.summary) {
    throw new Error("gbp_post_draft missing locationResource or summary");
  }

  // Image is required — the Inbox card gates the Approve button, but we
  // enforce here too so bulk-approve cannot bypass the check.
  if (!payload.uploadedImageUrl) {
    throw new Error("An image must be uploaded before a GBP post can be published. Open the post in the Inbox to add one.");
  }

  // Verify CTA URL is on an allowed domain before publishing to GBP
  if (payload.ctaUrl) {
    const loc = artifact.entityType === "GbpLocation" && artifact.entityId
      ? await prisma.gbpLocation.findUnique({
          where: { id: artifact.entityId },
          select: { websiteUri: true },
        })
      : null;
    await validateGbpCtaUrl(artifact.siteId, payload.ctaUrl, loc?.websiteUri);
  }

  const result = await createGbpLocalPost(
    artifact.siteId,
    payload.accountResource,
    payload.locationResource,
    {
      topicType: payload.topicType,
      summary: payload.summary,
      ctaType: payload.ctaType,
      ctaUrl: payload.ctaUrl,
      mediaUrl: payload.uploadedImageUrl,
    }
  );
  // Persist the published post into our local table so future syncs reconcile
  if (artifact.entityType === "GbpLocation" && artifact.entityId) {
    await prisma.gbpPost.create({
      data: {
        locationId: artifact.entityId,
        postName: result.name,
        topicType: payload.topicType,
        summary: payload.summary,
        ctaType: payload.ctaType,
        ctaUrl: payload.ctaUrl,
        mediaUrl: payload.uploadedImageUrl,
        state: "published",
        publishedAt: new Date(),
        searchUrl: result.searchUrl,
      },
    });
  }
  await logEvent({
    siteId: artifact.siteId,
    type: EVENT_TYPES.GBP_POST_PUBLISHED,
    title: `Published GBP ${payload.topicType} post`,
    payload: { resource: result.name, topicType: payload.topicType, summary: payload.summary.slice(0, 120) },
    entityType: "GbpLocation",
    entityId: artifact.entityId ?? undefined,
  });
  return { ok: true, result };
});

/* ── keyword_candidate → create a TrackedKeyword row ── */
registerPublisher("keyword_candidate", async (artifact) => {
  const payload = artifact.payload as unknown as KeywordCandidatePayload;
  if (!payload?.keyword) throw new Error("keyword_candidate missing keyword");
  // Idempotent: composite unique on (siteId, keyword)
  await prisma.trackedKeyword.upsert({
    where: { siteId_keyword: { siteId: artifact.siteId, keyword: payload.keyword } },
    update: {
      tier: payload.tier,
      intent: payload.intent,
      targetPage: payload.targetPage,
      isActive: true,
    },
    create: {
      siteId: artifact.siteId,
      keyword: payload.keyword,
      tier: payload.tier,
      intent: payload.intent,
      targetPage: payload.targetPage,
      clicks28d: payload.clicks28d,
      impressions28d: payload.impressions28d,
      ctr28d: payload.ctr28d,
      currentPosition: payload.position || null,
    },
  });
  await logEvent({
    siteId: artifact.siteId,
    type: EVENT_TYPES.KEYWORD_NEW_RANKING,
    title: `Now tracking "${payload.keyword}"`,
    payload: { keyword: payload.keyword, tier: payload.tier, intent: payload.intent, targetPage: payload.targetPage },
  });
  return { ok: true };
});

/* ── link_suggestions → edit the post body to insert links ── */
registerPublisher("link_suggestions", async (artifact) => {
  const payload = artifact.payload as unknown as LinkSuggestionsPayload;
  if (!payload?.sourcePostId || !Array.isArray(payload.suggestions)) {
    throw new Error("link_suggestions missing sourcePostId or suggestions");
  }
  const result = await applyLinkSuggestions(payload);
  await logEvent({
    siteId: artifact.siteId,
    type: EVENT_TYPES.CONTENT_UPDATED,
    title: `Internal links applied to ${payload.sourcePageUrl} (${result.applied} added)`,
    payload: { ...result, sourcePostId: payload.sourcePostId },
    entityType: "BlogPost",
    entityId: payload.sourcePostId,
  });
  return { ok: true, result };
});

registerPublisher("review_reply_draft", async (artifact) => {
  const payload = artifact.payload as ReviewReplyPayload;
  if (!payload?.reviewName || !payload.reply) {
    throw new Error("review_reply_draft missing reviewName or reply");
  }
  await replyToGbpReview(artifact.siteId, payload.reviewName, payload.reply);

  // Persist the reply onto our local GbpReview row so future syncs don't
  // re-detect it as "needs reply"
  if (artifact.entityType === "GbpReview" && artifact.entityId) {
    await prisma.gbpReview.update({
      where: { id: artifact.entityId },
      data: { reply: payload.reply, replyAt: new Date() },
    });
  }

  await logEvent({
    siteId: artifact.siteId,
    type: EVENT_TYPES.GBP_POST_PUBLISHED,
    title: `Replied to GBP review${payload.reviewerName ? ` from ${payload.reviewerName}` : ""}`,
    payload: { reviewName: payload.reviewName, rating: payload.rating ?? null },
    entityType: "GbpReview",
    entityId: artifact.entityId ?? undefined,
  });

  return { ok: true };
});
