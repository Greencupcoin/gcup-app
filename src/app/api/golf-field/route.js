export async function GET() {
  try {
    const res = await fetch(
      'https://feeds.datagolf.com/get-field?tour=pga&event=current&file_format=json&key=db3f3814c20325f1f267007628e8'
    );

    if (!res.ok) {
      console.error("❌ Data Golf API error:", res.status);
      return new Response('Failed to fetch field data', { status: res.status });
    }

    const data = await res.json();
    console.log("✅ Data Golf API responded:", JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("❌ Caught error in route.js:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

