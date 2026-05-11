/* ── Agent Artifact Publisher Registry ──
 * Tiny standalone module so that agent-artifacts.ts (consumer) and
 * agent-artifact-publishers.ts (producer) can share the registry without
 * a circular import. Both import from here.
 */

export interface PublishableArtifact {
  id: string;
  siteId: string;
  type: string;
  payload: unknown;
  entityType: string | null;
  entityId: string | null;
}

export type PublisherFn = (artifact: PublishableArtifact) => Promise<{ ok: true; result?: unknown }>;

const publishers = new Map<string, PublisherFn>();

export function registerPublisher(type: string, fn: PublisherFn) {
  publishers.set(type, fn);
}

export function getPublisher(type: string): PublisherFn | undefined {
  return publishers.get(type);
}
