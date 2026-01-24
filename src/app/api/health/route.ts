import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const startedAt = Date.now();

  // Try a lightweight query against Supabase
  let supabaseOk = false;
  let supabaseError: string | null = null;
  try {
    const { error } = await supabaseServer.from('properties').select('id').limit(1);
    supabaseOk = !error;
    supabaseError = error ? error.message : null;
  } catch (err: any) {
    supabaseOk = false;
    supabaseError = err?.message || 'Unknown error';
  }

  const elapsedMs = Date.now() - startedAt;

  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    elapsedMs,
    supabase: {
      ok: supabaseOk,
      error: supabaseError,
    },
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
}
