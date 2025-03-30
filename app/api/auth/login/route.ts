 import { API_URL } from '@/app/features/config';
import { NextRequest, NextResponse } from 'next/server';
 
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
const response = await fetch(`${API_URL}/Member/MemberAuthenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: body.user,
        password: body.password,
        tenant: 'string'
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}