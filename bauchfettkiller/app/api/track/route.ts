import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.DATAFAST_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { visitorId, name, metadata } = await request.json();

  if (!visitorId || !name) {
    return NextResponse.json({ error: 'Missing visitorId or name' }, { status: 400 });
  }

  const response = await fetch('https://datafa.st/api/v1/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      datafast_visitor_id: visitorId,
      name,
      ...(metadata && { metadata }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
