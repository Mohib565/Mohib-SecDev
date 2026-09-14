import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const { data: authRecord, error } = await supabase
      .from('admin_auth')
      .select('username, password')
      .eq('id', 1)
      .single();

    if (error || !authRecord) {
      if (username === 'admin' && password === 'admin123') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    if (username === authRecord.username && password === authRecord.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid username or password.' }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}