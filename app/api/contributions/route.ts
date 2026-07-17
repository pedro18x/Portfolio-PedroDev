import { NextResponse } from 'next/server';
import { getContributionsFresh } from '@/lib/github';

export const dynamic = 'force-dynamic';

/**
 * Contribuições do GitHub em tempo real: raspadas por requisição, sem cache.
 * O cliente troca o snapshot do build por esta resposta ao hidratar.
 */
export async function GET(): Promise<NextResponse> {
  const data = await getContributionsFresh();
  if (!data) {
    return NextResponse.json(
      { error: 'Could not load contributions right now.' },
      { status: 503 },
    );
  }
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
