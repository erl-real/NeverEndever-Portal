// Supabase Edge Runtime type definitions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Basic Core 001 is live!");

// Environment variables (safe, injected at runtime)
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

const ORIGIN = "https://neverendever.com";

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, content-type",
        },
        status: 204,
      });
    }

    // Normalize authorization header
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

    // Parse request body
    const { name } = await req.json();

    // Example payload — never expose full tokens
    const data = {
      message: `Signed in as ${name}!`,
      authHeaderReceived: !!authHeader,
      anonKeyLoaded: !!SUPABASE_ANON_KEY,
      serviceKeyLoaded: !!SUPABASE_SERVICE_ROLE_KEY,
      urlLoaded: !!SUPABASE_URL,
    };

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ORIGIN,
      },
      status: 500,
    });
  }
});
