## 2024-05-12 - [Hardcoded Service Role Keys]
**Vulnerability:** Service role keys or database credentials must not be hardcoded in the frontend or edge functions.
**Learning:** For Edge functions, using Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') safely references the environment variable securely injected by Supabase.
**Prevention:** Always use environment variables for backend secrets, never check them into git.
