import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const athlete = await prisma.athlete.findUnique({ where: { id } });
    if (!athlete) {
      return NextResponse.json({ error: 'Atleta no encontrado' }, { status: 404 });
    }
    return NextResponse.json(athlete);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const athlete = await prisma.athlete.update({
      where: { id },
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
    return NextResponse.json({ error: 'Error al actualizar el atleta' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.athlete.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el atleta' }, { status: 500 });
  }
}
