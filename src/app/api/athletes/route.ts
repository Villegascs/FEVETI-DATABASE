import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Check if cedula exists
    const existingAthlete = await prisma.athlete.findUnique({
      where: { cedula: data.cedula }
    });

    if (existingAthlete) {
      return NextResponse.json({ error: 'Ya existe un atleta con esta cédula' }, { status: 400 });
    }

    const athlete = await prisma.athlete.create({
      data: {
        cedula: data.cedula,
        fullName: data.fullName,
        birthDate: data.birthDate,
        modalities: data.modalities,
        association: data.association,
        club: data.club || null,
        joinDate: data.joinDate || null,
        expiryDate: data.expiryDate || null,
        isActive: data.isActive,
        photoUrl: data.photoUrl || null,
      }
    });

    return NextResponse.json(athlete);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(athletes);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
