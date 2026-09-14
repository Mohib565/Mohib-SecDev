import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { oldPassword, newPassword } = await request.json();

    const { data: authRecord, error: fetchErr } = await supabase
      .from('admin_auth')
      .select('password')
      .eq('id', 1)
      .single();

    if (fetchErr || !authRecord) {
      return NextResponse.json({ success: false, message: 'Database auth table nahi mila.' }, { status: 400 });
    }

    if (authRecord.password !== oldPassword) {
      return NextResponse.json({ success: false, message: 'Purana password galat hai!' }, { status: 401 });
    }

    const { error: updateErr } = await supabase
      .from('admin_auth')
      .update({
        password: newPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}