import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { statsChartClassName } from './stats-layout';

export default function StatsChartSkeleton() {
  return (
    <Card aria-hidden='true' className='min-w-0'>
      <CardHeader className='p-5 pb-4'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-5 w-5/6' />
      </CardHeader>
      <CardContent className='px-5 pb-4'><Skeleton className={statsChartClassName} /></CardContent>
      <CardFooter className='px-5 pb-5'><Skeleton className='h-5 w-2/3' /></CardFooter>
    </Card>
  );
}
