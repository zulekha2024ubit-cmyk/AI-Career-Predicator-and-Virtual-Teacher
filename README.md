# AI Career Predictor and Learning Platform

A Next.js (App Router) + Supabase app to help CS/SE students pick the right path with roadmaps, resources, and a virtual teacher.

## Quickstart

1. Copy env file and fill Supabase keys

```bash
# PowerShell (Windows)
Copy-Item .env.local.example .env.local
```

Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Install and run

```bash
npm install
npm run dev
```

3. Database schema (Supabase SQL)

Run this SQL in Supabase SQL editor:

```sql
-- user_profiles
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  gender text check (gender in ('male','female','prefer_not_to_say')),
  age int,
  country text,
  city text,
  current_level text, -- matric/intermediate/bachelor/master
  class_year text,
  field_of_study text,
  institute_name text,
  favorite_subjects text[],
  weak_subjects text[],
  technical_skills text[],
  soft_skills text[],
  career_interests text[],
  hobbies text,
  dream_career text,
  why_career text,
  work_type text, -- remote/on-site/hybrid
  motivation int,
  linkedin text,
  github text,
  resume_url text,
  selected_career_slug text, -- chosen prediction
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- materials (resources per roadmap step & category)
create table if not exists public.materials (
  id bigserial primary key,
  career_slug text not null, -- e.g., 'full-stack-web-development'
  step_id text not null,     -- e.g., 'intro-python'
  category text not null check (category in ('book','video','ppt','article','course','interactive')),
  title text not null,
  url text not null,
  duration text, -- optional: e.g., '4 hours', '30 minutes'
  note text, -- optional: e.g., 'BEST', 'Free Book', 'Interactive'
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.user_profiles enable row level security;
alter table public.materials enable row level security;

-- Policies
create policy "Users can manage own profile"
  on public.user_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Materials are readable by authenticated users"
  on public.materials for select using (auth.role() = 'authenticated');

-- Sample seed data for materials (comprehensive resources for all 16 career paths)
-- Note: All resources are dynamically loaded from JSON files in public/roadmaps/
-- This seed data is optional and for reference only
insert into public.materials (career_slug, step_id, category, title, url, duration, note) values
  -- Frontend Developer (10 steps, 50+ resources)
  ('frontend-developer', 'web-fundamentals', 'video', 'HTML & CSS Full Course', 'https://www.youtube.com/watch?v=G3e-cpL7ofc', '11 hours', null),
  ('frontend-developer', 'javascript-fundamentals', 'book', 'Eloquent JavaScript', 'https://eloquentjavascript.net/', null, 'Free Book'),
  ('frontend-developer', 'react-framework', 'course', 'React Official Tutorial', 'https://react.dev/learn', null, 'Official - BEST'),
  
  -- Full Stack Web Development (10 steps, 108 resources)
  ('full-stack-web-development', 'html-css', 'interactive', 'Flexbox Froggy', 'https://flexboxfroggy.com/', null, 'Fun way to learn'),
  ('full-stack-web-development', 'javascript-fundamentals', 'article', 'JavaScript Basics', 'https://javascript.info/first-steps', null, 'BEST Tutorial'),
  ('full-stack-web-development', 'react-framework', 'video', 'React Full Course', 'https://www.youtube.com/watch?v=bMknfKXIFA8', '8 hours', null),
  
  -- Backend Development (9 steps, 85+ resources)
  ('backend-development', 'choose-language', 'video', 'Node.js Full Course', 'https://www.youtube.com/watch?v=Oe421EPjeBE', '8 hours', 'For Node.js path'),
  ('backend-development', 'databases', 'article', 'PostgreSQL Tutorial', 'https://www.postgresqltutorial.com/', null, 'Recommended SQL'),
  ('backend-development', 'api-development', 'article', 'REST API Best Practices', 'https://restfulapi.net/', null, 'BEST'),
  
  -- Data Science & ML (12 steps, 100+ resources)
  ('data-science-ml', 'mathematics', 'video', 'Essence of Linear Algebra', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', null, '3Blue1Brown - BEST'),
  ('data-science-ml', 'python-programming', 'video', 'Python Full Course', 'https://www.youtube.com/watch?v=rfscVS0vtbw', '4.5 hours', null),
  ('data-science-ml', 'classical-ml', 'course', 'Machine Learning by Andrew Ng', 'https://www.coursera.org/specializations/machine-learning-introduction', null, 'BEST COURSE EVER'),
  
  -- AI/ML Engineer (13 steps, 120+ resources)
  ('ai-ml-engineer', 'mathematics', 'video', 'Essence of Linear Algebra', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', null, '3Blue1Brown - BEST'),
  ('ai-ml-engineer', 'deep-learning-frameworks', 'video', 'PyTorch Full Course', 'https://www.youtube.com/watch?v=V_xro1bcAuA', '10 hours', 'freeCodeCamp - BEST'),
  ('ai-ml-engineer', 'large-language-models', 'video', 'Let''s Build GPT', 'https://www.youtube.com/watch?v=kCc8FmEb1nY', null, 'Andrej Karpathy - BEST'),
  
  -- DevOps Engineer (12 steps, 140+ resources)
  ('devops-engineer', 'linux-os', 'video', 'Linux Full Course', 'https://www.youtube.com/watch?v=ROjZy1WbCIA', '5 hours', 'freeCodeCamp - BEST'),
  ('devops-engineer', 'docker', 'video', 'Docker Full Course', 'https://www.youtube.com/watch?v=3c-iBn73dDE', '3 hours', 'TechWorld with Nana - BEST'),
  ('devops-engineer', 'kubernetes', 'video', 'Kubernetes Full Course', 'https://www.youtube.com/watch?v=X48VuDVv0do', '4 hours', 'TechWorld with Nana - BEST'),
  
  -- Cybersecurity (12 steps, 90+ resources)
  ('cybersecurity', 'networking-fundamentals', 'video', 'Networking Full Course', 'https://www.youtube.com/watch?v=qiQR5rTSshw', '9 hours', 'freeCodeCamp - BEST'),
  ('cybersecurity', 'web-security', 'course', 'PortSwigger Web Security Academy', 'https://portswigger.net/web-security', null, 'FREE & BEST'),
  ('cybersecurity', 'penetration-testing', 'video', 'Practical Ethical Hacking', 'https://www.youtube.com/watch?v=3FNYvj2U0HM', null, 'The Cyber Mentor'),
  
  -- Cloud Engineer (12 steps, 77 resources - created by subagent)
  ('cloud-engineer', 'cloud-fundamentals', 'video', 'AWS Full Course', 'https://www.youtube.com/watch?v=ulprqHHWlng', '12 hours', 'freeCodeCamp - BEST'),
  ('cloud-engineer', 'infrastructure-as-code', 'video', 'Terraform Course', 'https://www.youtube.com/watch?v=SLB_c_ayRMo', '2 hours', 'BEST'),
  
  -- Data Engineer (11 steps, 57 resources - created by subagent)
  ('data-engineer', 'big-data', 'article', 'Apache Spark Tutorial', 'https://spark.apache.org/docs/latest/', null, null),
  ('data-engineer', 'data-pipelines', 'article', 'Apache Airflow Guide', 'https://airflow.apache.org/docs/', null, null),
  
  -- Mobile App Development (10 steps, 74 resources - created by subagent)
  ('mobile-app-development', 'react-native', 'article', 'React Native Tutorial', 'https://reactnative.dev/docs/tutorial', null, null),
  ('mobile-app-development', 'flutter', 'article', 'Flutter Complete Course', 'https://flutter.dev/learn', null, null),
  
  -- Game Development (9 steps, 62 resources - created by subagent)
  ('game-development', 'unity', 'course', 'Unity Complete Tutorial', 'https://learn.unity.com/', null, null),
  ('game-development', 'unreal', 'course', 'Unreal Engine Tutorial', 'https://www.unrealengine.com/en-US/learn', null, null),
  
  -- Blockchain Development (10 steps, 66 resources - created by subagent)
  ('blockchain-development', 'solidity', 'article', 'Solidity Documentation', 'https://docs.soliditylang.org/', null, null),
  ('blockchain-development', 'smart-contracts', 'article', 'Smart Contract Development', 'https://ethereum.org/en/developers/docs/smart-contracts/', null, null),
  
  -- QA Testing Engineer (11 steps, 68 resources - created by subagent)
  ('qa-testing-engineer', 'test-automation', 'article', 'Selenium Tutorial', 'https://www.selenium.dev/documentation/', null, null),
  ('qa-testing-engineer', 'api-testing', 'article', 'Postman Learning Center', 'https://learning.postman.com/', null, null),
  
  -- UI/UX Design (10 steps, 74 resources - created by subagent)
  ('ui-ux-design', 'design-tools', 'course', 'Figma Complete Tutorial', 'https://www.figma.com/resources/learn-design/', null, null),
  ('ui-ux-design', 'ux-research', 'article', 'UX Research Methods', 'https://www.nngroup.com/articles/', null, null);
  
  -- End of sample seed rows;
  -- add more for any remaining careers as needed;
  -- avoid removed slugs like 'software-engineer', 'machine-learning-engineer', 'data-scientist'.


-- Note: The website dynamically loads all 1,200+ resources from JSON files
-- Each roadmap has 50-140 comprehensive resources with URLs, types, durations, and notes
-- See public/roadmaps/ directory for complete resource lists

```

Optional: create a Storage bucket `resumes` (public: false) for resume uploads.

## Routes

- `/` Landing with auth modal (Supabase email/password + Google/GitHub)
- `/profile` Student profile form
- `/predictor` Career predictor summary + results
- `/roadmap/[slug]` Roadmap viewer
- `/learn/[slug]` Learning journey with resources + virtual teacher

## Deploy

- Push to GitHub and deploy on Vercel
- Set the same env vars in Vercel Project Settings

## Notes

- Roadmaps are local JSON in `roadmaps/`
- Styling uses Tailwind. Primary color: `#3B82F6`
- This repo includes placeholders to run out-of-the-box; replace with real assets later.
