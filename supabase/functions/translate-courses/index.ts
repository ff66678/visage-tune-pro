import { corsHeaders } from '@supabase/supabase-js/cors'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LOCALES = ['en', 'ja', 'ko', 'zh-TW'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all courses
    const { data: courses, error: coursesErr } = await supabase
      .from('courses')
      .select('id, title, subtitle, description, duration, expected_effect, target_audience');
    if (coursesErr) throw coursesErr;

    // Get existing translations to skip
    const { data: existing } = await supabase
      .from('course_translations')
      .select('course_id, locale');
    const existingSet = new Set((existing || []).map(e => `${e.course_id}:${e.locale}`));

    const results: string[] = [];

    for (const course of courses || []) {
      for (const locale of LOCALES) {
        if (existingSet.has(`${course.id}:${locale}`)) {
          results.push(`SKIP ${course.title} → ${locale}`);
          continue;
        }

        const langName = { en: 'English', ja: 'Japanese', ko: 'Korean', 'zh-TW': 'Traditional Chinese' }[locale];
        
        const prompt = `Translate the following Chinese face yoga course information into ${langName}. Return ONLY a valid JSON object with these fields: title, subtitle, description, duration, expected_effect, target_audience (array of strings). Keep it natural and professional. If a field is null/empty, return null for it.

Course data:
- title: ${course.title}
- subtitle: ${course.subtitle || ''}
- description: ${course.description || ''}
- duration: ${course.duration}
- expected_effect: ${course.expected_effect || ''}
- target_audience: ${JSON.stringify(course.target_audience || [])}

Return ONLY the JSON, no markdown formatting.`;

        const aiResp = await fetch('https://api.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
          }),
        });

        if (!aiResp.ok) {
          results.push(`ERROR ${course.title} → ${locale}: AI API ${aiResp.status}`);
          continue;
        }

        const aiData = await aiResp.json();
        let content = aiData.choices?.[0]?.message?.content || '';
        
        // Strip markdown code fences if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        let translated;
        try {
          translated = JSON.parse(content);
        } catch {
          results.push(`ERROR ${course.title} → ${locale}: parse failed`);
          continue;
        }

        const { error: insertErr } = await supabase
          .from('course_translations')
          .insert({
            course_id: course.id,
            locale,
            title: translated.title || course.title,
            subtitle: translated.subtitle || null,
            description: translated.description || null,
            duration: translated.duration || course.duration,
            expected_effect: translated.expected_effect || null,
            target_audience: translated.target_audience || null,
          });

        if (insertErr) {
          results.push(`ERROR ${course.title} → ${locale}: ${insertErr.message}`);
        } else {
          results.push(`OK ${course.title} → ${locale}: ${translated.title}`);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
