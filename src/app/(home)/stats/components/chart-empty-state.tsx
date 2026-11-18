import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { statsChartClassName } from './stats-layout';

export default function ChartEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Empty className={cn(statsChartClassName, 'min-h-0 p-4')}>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
