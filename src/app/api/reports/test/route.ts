import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Test if we can access the ChartingReport model
        const count = await prisma.chartingReport.count();

        return NextResponse.json({
            success: true,
            message: 'ChartingReport model is accessible',
            count,
            models: Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')),
        });
    } catch (error) {
        console.error('Test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
