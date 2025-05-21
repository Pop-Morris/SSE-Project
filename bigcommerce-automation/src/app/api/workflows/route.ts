import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, triggerEvent, conditionType, threshold, actionType, actionValue } = body;

  try {
    const workflow = await prisma.workflow.create({
      data: {
        name,
        triggerEvent,
        conditionType,
        threshold,
        actionType,
        actionValue,
      },
    });
    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(workflows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
} 