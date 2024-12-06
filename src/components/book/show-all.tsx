import { BookStatus } from '@/types/Book';
import { CircleChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  readStatus: BookStatus;
  label: string;
}

function ShowAll({ readStatus, label }: Props) {
  return (
    <div className='flex items-center justify-between'>
      <h3 className='font-semibold text-2xl text-white'>{label}</h3>
      <Link
        href={{ pathname: '/library', query: `status=${readStatus}` }}
        className='font-medium flex items-center gap-2 hover:underline'
      >
        Show All
        <CircleChevronRight size={20} fill='#CDE7BE' stroke='#181b1b' />
      </Link>
    </div>
  );
}

export default ShowAll;
