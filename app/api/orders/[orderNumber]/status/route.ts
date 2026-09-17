import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  return NextResponse.json({
    ok: true,
    data: {
      orderNumber,
      status: 'paid',
      paymentStatus: 'paid',
      isSimulated: true,
    },
  });
}
