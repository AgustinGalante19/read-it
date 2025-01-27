import { BookStatus } from '@/types/Book';

export default interface Option {
  id: number;
  value: BookStatus;
  icon: React.ReactNode;
  label: string;
}
