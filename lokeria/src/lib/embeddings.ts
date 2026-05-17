/**
 * Embedding Utility for Lokeria Recommendations
 *
 * Uses @xenova/transformers with all-MiniLM-L6-v2 model (384 dimensions).
 * The model is loaded once and cached at module level to avoid reloading
 * on subsequent calls within the same serverless invocation.
 *
 * This file MUST only be imported server-side (Server Actions / Route Handlers).
 */

import { pipeline } from "@xenova/transformers";

// Module-level singleton — survives across requests in the same instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embedder: any = null;

/**
 * Get or create the embedding pipeline singleton.
 * First call: ~2-4s (downloads + loads model into ONNX).
 * Subsequent calls on same instance: instant.
 */
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { quantized: true } // use quantized model for smaller download + faster inference
    );
  }
  return embedder;
}

/**
 * Generate a 384-dimensional embedding vector from text.
 * Uses mean pooling + normalization (default for sentence-transformers).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  const output = await pipe(text, { pooling: "mean", normalize: true });
  // output.data is Float32Array — convert to plain number array for Supabase
  return Array.from(output.data as Float32Array);
}

/**
 * Build semantic text from a user profile for embedding generation.
 *
 * Strategy:
 * - INCLUDE: headline, bio, skills, interests, skill_field, major
 *   → These carry job-matching semantic signal
 * - EXCLUDE: full_name, location, country, resume_url, timestamps
 *   → Names don't match jobs; location is handled by filtering, not semantics
 */
export function buildProfileSemanticText(profile: {
  headline?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  skill_field?: string | null;
  major?: string | null;
}): string {
  const parts: string[] = [];

  if (profile.headline) {
    parts.push(`Professional headline: ${profile.headline}`);
  }
  if (profile.bio) {
    parts.push(`About me: ${profile.bio}`);
  }
  if (profile.skills && profile.skills.length > 0) {
    parts.push(`Skills: ${profile.skills.join(", ")}`);
  }
  if (profile.interests && profile.interests.length > 0) {
    parts.push(`Interests: ${profile.interests.join(", ")}`);
  }
  if (profile.skill_field) {
    parts.push(`Field of expertise: ${profile.skill_field}`);
  }
  if (profile.major) {
    parts.push(`Education major: ${profile.major}`);
  }

  return parts.join(". ");
}

/**
 * Check if a profile has enough data to generate a meaningful embedding.
 * Requires at least headline OR bio OR skills to be present.
 */
export function hasEnoughProfileData(profile: {
  headline?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  skill_field?: string | null;
  major?: string | null;
}): boolean {
  return !!(
    profile.headline ||
    profile.bio ||
    (profile.skills && profile.skills.length > 0) ||
    (profile.interests && profile.interests.length > 0) ||
    profile.skill_field ||
    profile.major
  );
}
