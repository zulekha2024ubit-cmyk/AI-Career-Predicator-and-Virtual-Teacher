import { careerProfiles, CareerSlug } from './careerProfiles';

interface UserProfile {
  technical_skills?: string[];
  career_interests?: string[];
  favorite_subjects?: string[];
  soft_skills?: string[];
  field_of_study?: string;
  dream_career?: string;
  motivation?: number; // 0-10 scale expected
}

// Normalized weights summing to 100 for transparency
const WEIGHTS = {
  dreamCareer: 20,
  technicalSkills: 35,
  interests: 15,
  fieldOfStudy: 10,
  softSkills: 10,
  subjects: 5,
  motivation: 5
};

// Basic synonym / canonical mapping to improve matching quality
const SKILL_SYNONYMS: Record<string, string> = {
  js: 'javascript',
  html5: 'html',
  css3: 'css',
  nodejs: 'node',
  ml: 'machine learning',
  ai: 'artificial intelligence',
  db: 'database',
  sql: 'sql',
  postgres: 'postgresql',
  tf: 'tensorflow',
  cv: 'computer vision'
};

function canonicalize(term: string): string {
  const lower = term.toLowerCase().trim();
  if (SKILL_SYNONYMS[lower]) return SKILL_SYNONYMS[lower];
  // Collapse common punctuation/spaces
  return lower.replace(/\s+/g, ' ').replace(/[^a-z0-9 #+\.\-]/g, '');
}

export function enhancedHeuristicMatch(profile: UserProfile): Array<{ slug: string; score: number }> {
  const results = Object.entries(careerProfiles).map(([slug, careerProfile]) => {
    let score = 0;

    // DREAM CAREER preference (does not swamp everything else now)
    if (profile.dream_career) {
      const dream = canonicalize(profile.dream_career);
      const title = canonicalize(careerProfile.title);
      if (title === dream || title.includes(dream) || dream.includes(title)) {
        score += WEIGHTS.dreamCareer; // full weight
      } else if (careerProfile.keywords.some(kw => dream.includes(canonicalize(kw)) || canonicalize(kw).includes(dream))) {
        score += WEIGHTS.dreamCareer * 0.7; // strong partial
      } else {
        const dreamWords = dream.split(' ').filter(w => w.length > 3);
        const titleWords = title.split(' ').filter(w => w.length > 3);
        const partial = dreamWords.filter(dw => titleWords.some(tw => tw.includes(dw) || dw.includes(tw))).length;
        if (partial > 0) score += WEIGHTS.dreamCareer * 0.4; // light influence
      }
    }

    // TECHNICAL SKILLS hybrid absolute + coverage ratio
    if (profile.technical_skills && profile.technical_skills.length) {
      const userSkills = profile.technical_skills.map(canonicalize);
      const careerSkills = careerProfile.keywords.map(canonicalize);
      let matchCount = 0;
      const matched = new Set<string>();
      for (const u of userSkills) {
        for (const c of careerSkills) {
          if (matched.has(c)) continue;
          if (u === c || u.includes(c) || c.includes(u)) {
            matched.add(c);
            matchCount++;
            break;
          }
        }
      }
      const coverageRatio = matchCount / Math.max(careerSkills.length, 1); // how much of the career profile the user covers
      const userFocusRatio = matchCount / Math.max(userSkills.length, 1); // how focused the user's listed skills are toward this career
      // Blend: prioritize absolute relevant matches while considering concentration
      const blended = (0.55 * coverageRatio) + (0.45 * userFocusRatio);
      const techScore = Math.min(1, blended * 1.3) * WEIGHTS.technicalSkills; // mild amplification, capped
      score += techScore;
    }

    // CAREER INTERESTS
    if (profile.career_interests && profile.career_interests.length) {
      const userInterests = profile.career_interests.map(canonicalize);
      const careerInterests = careerProfile.interests.map(canonicalize);
      const match = careerInterests.filter(ci => userInterests.some(ui => ui.includes(ci) || ci.includes(ui))).length;
      const ratio = match / Math.max(careerInterests.length, 1);
      score += ratio * WEIGHTS.interests;
    }

    // FIELD OF STUDY
    if (profile.field_of_study) {
      const field = canonicalize(profile.field_of_study);
      if (careerProfile.fields.some(f => {
        const cf = canonicalize(f);
        return field === cf || field.includes(cf) || cf.includes(field);
      })) {
        score += WEIGHTS.fieldOfStudy;
      }
    }

    // SOFT SKILLS (scaled by diversity and match depth)
    if (profile.soft_skills && profile.soft_skills.length) {
      const userSoft = profile.soft_skills.map(canonicalize);
      const careerSoft = careerProfile.softSkills.map(canonicalize);
      const matchSoft = careerSoft.filter(cs => userSoft.some(us => us.includes(cs) || cs.includes(us))).length;
      const softRatio = matchSoft / Math.max(careerSoft.length, 1);
      score += softRatio * WEIGHTS.softSkills;
    }

    // FAVORITE SUBJECTS boosts (contextual)
    if (profile.favorite_subjects && profile.favorite_subjects.length) {
      const subjects = profile.favorite_subjects.map(canonicalize);
      const stemTokens = ['math', 'science', 'computer', 'physics', 'chemistry', 'mathematics'];
      const creativeTokens = ['art', 'design', 'creative', 'drawing', 'visual'];
      const hasStem = subjects.some(s => stemTokens.some(st => s.includes(st)));
      const hasCreative = subjects.some(s => creativeTokens.some(ct => s.includes(ct)));
      if (hasStem && slug !== 'ui-ux-design') {
        score += WEIGHTS.subjects * 0.9;
      }
      if (hasCreative && slug === 'ui-ux-design') {
        score += WEIGHTS.subjects; // full weight for direct design alignment
      }
    }

    // MOTIVATION scaling (0-10)
    if (typeof profile.motivation === 'number') {
      const m = Math.max(0, Math.min(10, profile.motivation));
      score += (m / 10) * WEIGHTS.motivation;
    }

    // Final rounding for stable presentation
    return { slug, score: Math.round(score) };
  });

  // Sort by descending score
  return results.sort((a, b) => b.score - a.score);
}
