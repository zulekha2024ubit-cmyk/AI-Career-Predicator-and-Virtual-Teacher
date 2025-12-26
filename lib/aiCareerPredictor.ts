// AI predictor stub retained only to avoid breaking legacy imports.
// Original implementation removed with @xenova/transformers package.
// This now returns the provided candidates in original order with descending scores.

export interface AIPredictorInput {
  technical_skills?: string[];
  career_interests?: string[];
  dream_career?: string;
  field_of_study?: string;
  soft_skills?: string[];
  favorite_subjects?: string[];
}

export async function aiCareerPrediction(
  _profile: AIPredictorInput,
  topCandidates: Array<{ slug: string; title: string }>
): Promise<Array<{ slug: string; score: number }>> {
  return topCandidates.map((c, i) => ({ slug: c.slug, score: 100 - i * 5 }));
}

export async function initializeAI() {
  return null; // No-op
}
