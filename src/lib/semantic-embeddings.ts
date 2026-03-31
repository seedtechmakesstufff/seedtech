/* ── Semantic Embeddings ──
 *
 * Provides text embedding + cosine similarity for smarter content gap analysis.
 * Uses OpenAI's text-embedding-3-small model (cheap, fast, 1536 dims).
 *
 * Falls back to TF-IDF bag-of-words cosine similarity when no API key is available.
 */

/* ── Types ── */

export interface EmbeddingResult {
  text: string;
  embedding: number[];
}

/* ── Config ── */

const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 512; // Reduced dimensions for efficiency
const BATCH_SIZE = 50; // OpenAI supports up to 2048 inputs per batch

/* ── OpenAI Embedding API ── */

/**
 * Generate embeddings for an array of texts using OpenAI's API.
 * Returns null if API key is not configured — caller should fall back to TF-IDF.
 */
export async function embedTexts(
  texts: string[]
): Promise<number[][] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || texts.length === 0) return null;

  const allEmbeddings: number[][] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_EMBEDDING_MODEL,
          input: batch,
          dimensions: EMBEDDING_DIMENSIONS,
        }),
      });

      if (!response.ok) {
        console.warn(`[embeddings] OpenAI API error ${response.status}`);
        return null;
      }

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sorted = (data.data as any[]).sort((a, b) => a.index - b.index);
      const embeddings = sorted.map((d: { embedding: number[] }) => d.embedding);

      allEmbeddings.push(...embeddings);
    } catch (err) {
      console.warn("[embeddings] OpenAI API call failed:", err);
      return null;
    }
  }

  return allEmbeddings;
}

/* ── Cosine Similarity ── */

/**
 * Calculate cosine similarity between two vectors.
 * Returns a value between -1 and 1 (1 = identical direction).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Find the best matching text from `candidates` for each `query`.
 * Returns an array of { queryIndex, candidateIndex, similarity } sorted by similarity desc.
 */
export function findBestMatches(
  queryEmbeddings: number[][],
  candidateEmbeddings: number[][],
  threshold = 0.5
): { queryIndex: number; candidateIndex: number; similarity: number }[] {
  const matches: { queryIndex: number; candidateIndex: number; similarity: number }[] = [];

  for (let q = 0; q < queryEmbeddings.length; q++) {
    for (let c = 0; c < candidateEmbeddings.length; c++) {
      const sim = cosineSimilarity(queryEmbeddings[q], candidateEmbeddings[c]);
      if (sim >= threshold) {
        matches.push({ queryIndex: q, candidateIndex: c, similarity: sim });
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

/* ── TF-IDF Fallback ── */

/**
 * Simple TF-IDF bag-of-words vectorizer for when OpenAI isn't available.
 * Not as good as neural embeddings but much better than exact string matching.
 */
export function tfidfVectorize(texts: string[]): number[][] {
  // Tokenize all texts
  const allTokens: string[][] = texts.map((t) => tokenize(t));

  // Build vocabulary (all unique tokens)
  const vocab = new Map<string, number>();
  const docFreq = new Map<string, number>(); // how many docs contain this token

  for (const tokens of allTokens) {
    const uniqueTokens = Array.from(new Set(tokens));
    for (const token of uniqueTokens) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
      if (!vocab.has(token)) {
        vocab.set(token, vocab.size);
      }
    }
  }

  const vocabSize = vocab.size;
  const numDocs = texts.length;

  // Build TF-IDF vectors
  return allTokens.map((tokens) => {
    const vector = new Array(vocabSize).fill(0);

    // Count term frequencies
    const termCounts = new Map<string, number>();
    for (const token of tokens) {
      termCounts.set(token, (termCounts.get(token) || 0) + 1);
    }

    const maxTf = Math.max(...Array.from(termCounts.values()), 1);

    for (const [term, count] of Array.from(termCounts.entries())) {
      const idx = vocab.get(term);
      if (idx === undefined) continue;

      // Augmented term frequency (prevents bias towards long documents)
      const tf = 0.5 + (0.5 * count) / maxTf;
      // Inverse document frequency
      const idf = Math.log(numDocs / (docFreq.get(term) || 1));
      vector[idx] = tf * idf;
    }

    return vector;
  });
}

/**
 * Tokenize text into lowercase terms, removing stopwords and short words.
 */
function tokenize(text: string): string[] {
  const stopwords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "this", "that",
    "these", "those", "it", "its", "not", "no", "if", "then", "than",
    "so", "as", "we", "you", "they", "he", "she", "i", "my", "your",
    "our", "their", "what", "which", "who", "when", "where", "how", "all",
    "each", "every", "both", "few", "more", "most", "other", "some", "such",
    "about", "into", "through", "during", "before", "after", "above",
    "below", "between", "out", "off", "over", "under", "again", "further",
    "once", "here", "there", "why", "just", "also", "very", "too",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

/* ── High-Level API ── */

/**
 * Compute pairwise similarity between two sets of texts.
 * Uses OpenAI embeddings when available, falls back to TF-IDF.
 *
 * Returns a matrix where result[i][j] = similarity between queries[i] and candidates[j].
 */
export async function computeSimilarityMatrix(
  queries: string[],
  candidates: string[]
): Promise<{ matrix: number[][]; method: "openai" | "tfidf" }> {
  // Try OpenAI first
  const allTexts = [...queries, ...candidates];
  const embeddings = await embedTexts(allTexts);

  if (embeddings && embeddings.length === allTexts.length) {
    const queryEmbeddings = embeddings.slice(0, queries.length);
    const candidateEmbeddings = embeddings.slice(queries.length);

    const matrix = queryEmbeddings.map((qEmb) =>
      candidateEmbeddings.map((cEmb) => cosineSimilarity(qEmb, cEmb))
    );

    return { matrix, method: "openai" };
  }

  // Fall back to TF-IDF
  const vectors = tfidfVectorize(allTexts);
  const queryVectors = vectors.slice(0, queries.length);
  const candidateVectors = vectors.slice(queries.length);

  const matrix = queryVectors.map((qVec) =>
    candidateVectors.map((cVec) => cosineSimilarity(qVec, cVec))
  );

  return { matrix, method: "tfidf" };
}
