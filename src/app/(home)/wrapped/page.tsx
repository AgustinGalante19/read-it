import { getYearlyRecap } from '@/services/StatsService';
import { Card, CardContent } from '@/components/ui/card';
import WrappedStory from './components/wrapped-story';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function WrappedPage() {
  const currentYear = new Date().getFullYear();
  const recapResult = await getYearlyRecap(currentYear);

  if (!recapResult.success || !recapResult.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Could not load your recap</h1>
        <p className="text-muted-foreground mb-4">Try again later.</p>
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back home
        </Link>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden">
      <WrappedStory recap={recapResult.data} />
    </main>
  );
}
