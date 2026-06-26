export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'GET') {
    const result = await db.prepare('SELECT value FROM app_state WHERE key = "9lives_data"').first();
    if (result) {
      return new Response(result.value, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response('{}', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'POST') {
    const body = await request.text();
    await db.prepare('INSERT OR REPLACE INTO app_state (key, value) VALUES ("9lives_data", ?)').bind(body).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}
