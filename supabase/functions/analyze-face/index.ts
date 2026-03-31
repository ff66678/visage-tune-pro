import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const { photo_url } = await req.json();
    if (!photo_url) {
      return new Response(JSON.stringify({ error: "photo_url is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional facial skin analysis AI. Analyze the provided face photo and return scores. You MUST call the function provided.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this face photo and provide detailed scores for skin elasticity, overall health, nasolabial fold severity, jawline definition, and eye contour condition." },
              { type: "image_url", image_url: { url: photo_url } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "face_analysis_result",
              description: "Return face analysis scores",
              parameters: {
                type: "object",
                properties: {
                  elasticity_score: { type: "integer", description: "Skin elasticity score 0-100" },
                  health_grade: { type: "string", enum: ["A+", "A", "B+", "B", "C+", "C", "D"], description: "Overall health grade" },
                  nasolabial_level: { type: "string", enum: ["minimal", "mild", "moderate", "noticeable", "prominent"], description: "Nasolabial fold severity" },
                  jawline_level: { type: "string", enum: ["excellent", "good", "moderate", "fair", "poor"], description: "Jawline definition" },
                  eye_contour_score: { type: "integer", description: "Eye contour condition score 0-100" },
                },
                required: ["elasticity_score", "health_grade", "nasolabial_level", "jawline_level", "eye_contour_score"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "face_analysis_result" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "分析请求过于频繁，请稍后再试" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI 额度已用尽" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI error:", status, t);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis result from AI");

    const scores = JSON.parse(toolCall.function.arguments);

    // Insert into DB
    const { data: record, error: dbError } = await supabase
      .from("face_analyses")
      .insert({
        user_id: userId,
        photo_url,
        elasticity_score: scores.elasticity_score,
        health_grade: scores.health_grade,
        nasolabial_level: scores.nasolabial_level,
        jawline_level: scores.jawline_level,
        eye_contour_score: scores.eye_contour_score,
        analysis_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(JSON.stringify(record), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-face error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
