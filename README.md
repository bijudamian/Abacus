# Sara Abacus
A portal for giving out tests for students and an admin management dashboard.

## Infrastructure

This project has been migrated to Supabase and Vercel.

**Supabase**
- **Auth**: Replaces Firebase Auth for admin and student logins. Includes edge function `create-student` for secure admin user creation.
- **Database**: PostgreSQL replaces Firestore.
  - `scores` table (id, student_name, level, score, max_score, created_at)
  - `quizzes` table to store dynamically generated quizzes and securely hold answers.
  - RLS policies ensure students can only view their own scores/quizzes. Admins have full access.
- **Edge Functions**:
  - `generate-quiz`: Generates a dynamic quiz using level-specific logic and constraints and stores it securely.
  - `validate-quiz`: Validates a quiz submission against the securely stored backend data to prevent cheating.
  - `create-student`: Admin-only function to securely create student accounts without disrupting auth state.

**Vercel**
- Deployed statically with `vercel.json` rewriting paths.

## Setup

1. Install Vercel CLI `npm i -g vercel`.
2. Login to Vercel `vercel login`.
3. Run `vercel` in root directory to deploy.
