// Supabase Edge Runtime type definitions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Basic Core 001 is live!");

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, content-type",
        },
        status: 204,
      });
    }

    // Parse request body
    const { name } = await req.json();

    const data = {
      message: `Hello ${name}, Basic Core 001 is working!`,
    };

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
