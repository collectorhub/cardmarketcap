import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  
  // Apple sends the 'code' and 'state' in the body
  const code = formData.get('code');
  const state = formData.get('state');

  // Redirect to your existing success page with the data in the URL
  // This allows your useEffect in page.tsx to "see" the code
  return NextResponse.redirect(
    new URL(`/auth/success?code=${code}&provider=apple`, request.url),
    303
  );
}