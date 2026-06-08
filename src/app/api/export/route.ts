import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const data = athletes.map(a => ({
      'Cédula': `V-${a.cedula}`,
      'Nombres y Apellidos': a.fullName,
      'Fecha de Nacimiento': new Date(a.birthDate).toLocaleDateString('es-VE'),
      'Asociación/Club': a.association,
      'Modalidades': a.modalities,
      'Estado': a.isActive ? 'Activo' : 'Inactivo',
      'Fecha de Registro': new Date(a.createdAt).toLocaleDateString('es-VE')
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Atletas FEVETI');

    // Generate buffer
    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="Base_Datos_FEVETI.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });
  } catch (error) {
    console.error('Error generating Excel', error);
    return NextResponse.json({ error: 'Error al generar el archivo' }, { status: 500 });
  }
}
