import SearchForm from './components/search-form';
import { searchPageClassName } from './components/search-layout';

export default function Search() {
  return (
    <main className={searchPageClassName}>
      <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>Search</h1>
      <SearchForm />
    </main>
  );
}
