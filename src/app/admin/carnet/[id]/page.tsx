import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CarnetClient from './CarnetClient';

export default async function CarnetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const athlete = await prisma.athlete.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!athlete) {
    notFound();
  }

  // Define base URL for QR code (the public profile URL)
  // In production, this should be the actual domain
  const publicProfileUrl = `/atleta/${athlete.id}`;

  return (
    <CarnetClient athlete={athlete} publicProfileUrl={publicProfileUrl} />
  );
}
