import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer' // 按你自己的路径改

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params   // ⭐ 必须 await

  const numericId = Number(id)

  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', numericId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}