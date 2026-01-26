import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '未找到房源' }, { status: 404 });
  }
  return NextResponse.json(data);
}
