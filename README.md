# NeverEndever-Portal
# Artist Portal

A simple artist profile portal using Supabase authentication and database.

## Setup
1. Create a Supabase project.
2. Enable Email authentication.
3. Create a `profiles` table with columns:
   - `id` (uuid, primary key, references auth.users)
   - `username` (text)
   - `bio` (text)
4. Replace `SUPABASE_KEY` in `supabaseClient.js` with your anon key.
5. Deploy to your hosting provider (e.g., Vercel, Netlify, Cloudflare Pages).
