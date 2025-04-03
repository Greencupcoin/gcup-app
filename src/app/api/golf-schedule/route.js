export async function GET() {
  const res = await fetch(
    'https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=db3f3814c20325f1f267007628e8'
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
