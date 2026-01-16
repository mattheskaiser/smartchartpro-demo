import { NextRequest, NextResponse } from 'next/server';

// This route now just receives the PDF data from the client
// The actual PDF generation happens client-side to avoid React PDF + Next.js SSR issues
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfData } = body;

    if (!pdfData) {
      return NextResponse.json({ error: 'No PDF data provided' }, { status: 400 });
    }

    console.log('Received PDF data, size:', pdfData.length);

    // Simply return the PDF data back
    // The client will handle saving it to the database
    return NextResponse.json({ pdfData });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
