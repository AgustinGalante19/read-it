'use client';

import React from 'react';
import { Book, BookOpen, ChartBar, Tag, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import ShowAll from '@/components/book/show-all';
import BooksList from '@/components/book/books-list';

const chartData = [
  { month: 'July', desktop: 1 },
  { month: 'August', desktop: 1 },
  { month: 'September', desktop: 2 },
  { month: 'October', desktop: 3 },
  { month: 'November', desktop: 2 },
  { month: 'Dicember', desktop: 1 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const recentBooks = [
  {
    id: 4,
    google_id: 'qTbDDwAAQBAJ',
    title: '1793 (Trilogía de Estocolmo 1)',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=qTbDDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71k3MhKIr-IHqETu9pWwuZPFnrKnEv4RyIjKRYbKIYOawSveFA2biv1i2RORHLXIN5txIhJwEu47pHKTVw4lFcgSGBu2rZrMkqBqgHHc920vIqi2t4F__azQcwo_SBRHDUGOk9h&source=gbs_api',
    authors: 'Niklas Natt och Dag',
    publish_date: '16/01/2020',
    is_readed: true,
    page_count: 432,
    inserted_at: new Date('2024-12-04T12:50:25.414Z'),
    readed_at: new Date('2024-02-15T15:00:00.000Z'),
    tags: 'Fiction / Thrillers / Historical, Fiction / Mystery & Detective / Amateur Sleuth',
  },
  {
    id: 5,
    google_id: 'ptsPEAAAQBAJ',
    title: '1794 (Trilogía de Estocolmo 2)',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=ptsPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72-didiZQQHhIsG72gHQh0iquJ0F3ZRwfo_ATzqPuB2DEny293ABO-l0Kb41YFQYIx1bZTh_h_H8rg518YkOJn0uUQpwKNCq_R9y4zPVIlYrbV_8tQfOT6YGsha0xBBXRungP9g&source=gbs_api',
    authors: 'Niklas Natt och Dag',
    publish_date: '04/03/2021',
    is_readed: true,
    page_count: 512,
    inserted_at: new Date('2024-12-04T12:51:57.350Z'),
    readed_at: new Date('2024-03-10T15:00:00.000Z'),
    tags: 'Fiction / Thrillers / Historical, Fiction / Mystery & Detective / Amateur Sleuth',
  },
  {
    id: 30,
    google_id: 'fHm2EAAAQBAJ',
    title: '1984',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=fHm2EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71EqhhHcVX6ei7WrpQXNnPuUZFe0nRZp--tIbeU5pSPricTdjCDLWmQ-V79lumy21vZStluiMM1768JYq4He_v3WljmKvdFEkfYYyUefWCrjJsrUNH8VOU0Hl7bKNPXvkp9-1NL&source=gbs_api',
    authors: 'George Orwell',
    publish_date: '06/01/2023',
    is_readed: true,
    page_count: 288,
    inserted_at: new Date('2024-12-31T11:57:05.262Z'),
    readed_at: new Date('2024-08-20T15:00:00.000Z'),
    tags: 'Fiction / Dystopian, Fiction / Psychological, Fiction / Political',
  },
  {
    id: 28,
    google_id: 'Hewh95xKTygC',
    title: 'Cementerio de animales',
    thumbnail_url:
      'http://books.google.com/books/content?id=Hewh95xKTygC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72vReWN8IXHW8MWTlpevgl8Xn2QyHKSOr0AJDlkzNJe_AiO5CKr1jSaWxjWZx4twx3kF0Yv_wT2PqhvsbHw1vt88vyQzJ4KERKevyFsfJi_IHjfls005w9MaJsQc9Yu9XiZUmIS&source=gbs_api',
    authors: 'Stephen King',
    publish_date: '24/10/2012',
    is_readed: true,
    page_count: 488,
    inserted_at: new Date('2024-12-31T11:51:52.337Z'),
    readed_at: new Date('2024-06-22T18:00:00.000Z'),
    tags: 'Fiction / Occult & Supernatural, Fiction / Horror',
  },
  {
    id: 6,
    google_id: 'W5sc9hBObewC',
    title: 'Crimen y castigo',
    thumbnail_url:
      'http://books.google.com/books/content?id=W5sc9hBObewC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70eSGMlsarwN4KJ7RCIOAtE5R8CmUO9izG_-4SN3odG5fXuWz-RRIR1DU6QLXc5FiWNumZ-TtAWKunGIFoZQHA7DUKupeeRqA6G9LQ01B8pClXC8qfnsy5aDMqJpgRFphmjcW0_&source=gbs_api',
    authors: 'Fiodor Dostoyevski',
    publish_date: '28/07/2006',
    is_readed: true,
    page_count: 544,
    inserted_at: new Date('2024-12-06T11:49:02.392Z'),
    readed_at: new Date('2024-07-23T18:00:00.000Z'),
    tags: 'Literary Collections / Ancient & Classical, Juvenile Nonfiction / Language Arts / General',
  },
  {
    id: 27,
    google_id: 'GVTbvLBiHfoC',
    title: 'Dagon',
    thumbnail_url:
      'http://books.google.com/books/content?id=GVTbvLBiHfoC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70HPH07gwWN1ua97NzUYdOS56d0ZhzeS9_I6wx5LQ7qey4iHhaBY_IWxkPjDNAnze5JPbI2cDgWUa-p2xLkpaT0iYITK1V_xbhIEzsMWut-Erd3UpN28tLj9t3OFSr1GTS1AV26&source=gbs_api',
    authors: 'H. P. Lovecraft',
    publish_date: '01/09/2003',
    is_readed: true,
    page_count: 96,
    inserted_at: new Date('2024-12-31T11:50:45.977Z'),
    readed_at: new Date('2024-12-29T18:00:00.000Z'),
    tags: 'Fiction / Horror, Fiction / Short Stories (single author)',
  },
  {
    id: 14,
    google_id: 'Sq2q36GwMBsC',
    title: 'El túnel',
    thumbnail_url:
      'http://books.google.com/books/content?id=Sq2q36GwMBsC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73VjWE7rhrFMKLNfPLuNkwSuS9ZzJX22JNIvhjC565b2kd9Sp1xsFGrRGUJOJgLhvbIqVEbpPmboLiOzVSoBYgHn7wKE7FzD4CYbkm-7I0hxU4c61cLMpdYpAUQw7_W7fYZWkJc&source=gbs_api',
    authors: 'Ernesto Sabato',
    publish_date: '12/07/2010',
    is_readed: true,
    page_count: 160,
    inserted_at: new Date('2024-12-09T15:45:11.669Z'),
    readed_at: new Date('2024-09-28T18:00:00.000Z'),
    tags: 'Fiction / General',
  },
  {
    id: 19,
    google_id: '3ZQFEAAAQBAJ',
    title: 'El visitante / End of Watch',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=3ZQFEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE734l9CKTiNSSZ3-Esyi4cTL82_9EXVt6fkOAUOpuHCLo4YssUUWoo_CvkNJXgDFEdSDwvsV0Ea28pYLEJC53hf_GD9RP970x-Y9cJ9pdh-hDV_jy_IJrSXhuk4UjTDB2FDn2hiC&source=gbs_api',
    authors: 'Stephen King',
    publish_date: '09/22/2020',
    is_readed: true,
    page_count: 592,
    inserted_at: new Date('2024-12-09T16:08:00.808Z'),
    readed_at: new Date('2024-05-16T18:00:00.000Z'),
    tags: 'Fiction / Horror, Fiction / Thrillers / Psychological, Fiction / Thrillers / Suspense',
  },
  {
    id: 16,
    google_id: 'NwnfvxTaZeQC',
    title: 'Fahrenheit 451',
    thumbnail_url:
      'http://books.google.com/books/content?id=NwnfvxTaZeQC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73oPRQSHE6B6ZYaUtwNZKd930UCaDW8qBsLXQNBZHqGk_E47yPyznhiazufJCqhZHTfQyibJrd8SeJkgV5FPG70UXh2dUzb02OiQOcT999-sVNJF8aG9W3zyu2-37QqMhqhvM_e&source=gbs_api',
    authors: 'Ray Bradbury',
    publish_date: '2010-01',
    is_readed: true,
    page_count: 174,
    inserted_at: new Date('2024-12-09T15:47:36.234Z'),
    readed_at: new Date('2024-07-10T18:00:00.000Z'),
    tags: 'Fiction / Classics, Fiction / Literary, Fiction / Science Fiction / General',
  },
  {
    id: 2,
    google_id: 'iqegDwAAQBAJ',
    title: 'La paciente silenciosa',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=iqegDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72JKCKSsmIadHXIKUHL5bEWNOiFpCS_VwAKc_tBeX4wA37l7aOJeGBAfWkiJBdLLew1QK6E8VLPA15RKIS_04CYmneq0olXaEUIjldn8kgdZIRsRNfcW8FCMZgjd2B3OOf4N4T-&source=gbs_api',
    authors: 'Alex Michaelides',
    publish_date: '05/09/2019',
    is_readed: true,
    page_count: 384,
    inserted_at: new Date('2024-12-02T15:43:08.567Z'),
    readed_at: new Date('2024-12-05T18:00:00.000Z'),
    tags: 'Fiction / Thrillers / General, Fiction / Thrillers / Psychological',
  },
  {
    id: 29,
    google_id: 't4ueEAAAQBAJ',
    title: 'Materia oscura',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=t4ueEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70kMsJaJaWNecdIorqV55po2kbMqXFq013iGw0qRRukHWZxhHjfbGxUYXZ8mU3eMVB9mWlxnCjBir9ixq4IE9nJhtG84PKOFTi5Xvtg8JaDFX2R31q9HgIaAsnFW195VOi8XPY7&source=gbs_api',
    authors: 'Blake Crouch',
    publish_date: '11/09/2017',
    is_readed: true,
    page_count: 419,
    inserted_at: new Date('2024-12-31T11:56:37.066Z'),
    readed_at: new Date('2024-11-30T18:00:00.000Z'),
    tags: 'Fiction / Science Fiction / General, Fiction / Science Fiction / Hard Science Fiction',
  },
  {
    id: 22,
    google_id: 'QbUACwAAQBAJ',
    title: 'Misery',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=QbUACwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE712kNalkpwjy4UrCEKOhtNR9m3xCNKxqoejWmGn9iAzEhUWnN_bFE37pQhfqE1DtxSyrTuU6647iBXRnix5wjGEHt2xxVvwvt1tyezqUHVbIWEINMat4Ez8Us2WsKWRS8uioXmu&source=gbs_api',
    authors: 'Stephen King',
    publish_date: '01/01/2016',
    is_readed: true,
    page_count: 400,
    inserted_at: new Date('2024-12-16T04:05:47.574Z'),
    readed_at: new Date('2024-08-14T18:00:00.000Z'),
    tags: 'Fiction / Thrillers / Suspense, Fiction / Horror, Fiction / Psychological',
  },
  {
    id: 33,
    google_id: 'VmM4EQAAQBAJ',
    title: 'Noches blancas',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=VmM4EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71mqBNjNyg_kg1SiGlJIWbYMcm8td47U1CzjZ5sQ8t97ASvUiztuxWF8Zf7DPmTpMprt7Z53nz7zm6aW2hbe-I-Yry2KEG-S1Eqz7QMavAn2_Z304k8yHgPKB1ED4T0sUTGpTdl&source=gbs_api',
    authors: 'Fiódor Dostoievski',
    publish_date: '11/29/2024',
    is_readed: true,
    page_count: 88,
    inserted_at: new Date('2025-01-08T11:22:38.918Z'),
    readed_at: new Date('2024-12-28T18:00:00.000Z'),
    tags: 'Fiction / Classics',
  },
  {
    id: 3,
    google_id: 'kmwZEAAAQBAJ',
    title: 'Nuestra parte de noche',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=kmwZEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72cJpv5s84DBgotLg90b1-SFt-np0FxCyTDnalxFCPILDGSg4iLEHkNYbVYfrCXEi4hyPvoeiaeF-aNiZKNPVpbp3-kjtH0wEhYvDZ7q_5_L0ukI6qCJ1Q_KR25_KwuY7EZ_pN9&source=gbs_api',
    authors: 'Mariana Enríquez',
    publish_date: '26/01/2021',
    is_readed: true,
    page_count: 672,
    inserted_at: new Date('2024-12-03T12:37:13.904Z'),
    readed_at: new Date('2024-11-20T18:00:00.000Z'),
    tags: 'Fiction / General, Fiction / Psychological',
  },
  {
    id: 17,
    google_id: 't1slEAAAQBAJ',
    title: 'Proyecto Hail Mary',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=t1slEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE704MKsLJyo1mx9lwbH4-NM7h_mzW_9L8uPmScs_LulDhX29NxBTMBSjm0dRFk_2mb2ezOWNZvLxWTLmUeXYvrzK0NgRxURH9W-voPgc149GYCQ9nvL6dGzjmoV5cRmUOqHj3AWv&source=gbs_api',
    authors: 'Andy Weir',
    publish_date: '20/05/2021',
    is_readed: true,
    page_count: 544,
    inserted_at: new Date('2024-12-09T15:50:21.786Z'),
    readed_at: new Date('2024-03-10T18:00:00.000Z'),
    tags: 'Fiction / Science Fiction / General, Fiction / Science Fiction / Space Opera',
  },
  {
    id: 35,
    google_id: 'vEXhAwAAQBAJ',
    title: 'Psycho',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=vEXhAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72CKBy-Nj0N1iYu0wPNQCCZkeswXcQBPstUR_XQxlZlxq-tM30xn3LBn_07gV09qSEpYTVD48DxXVWwwFiv00w0_kTRjTbYzb0DQYp3mqpziBjTkD_5FJZibGYMKx84H9DroQvz&source=gbs_api',
    authors: 'Robert Bloch',
    publish_date: '07/14/2014',
    is_readed: true,
    page_count: 240,
    inserted_at: new Date('2025-01-19T01:53:06.707Z'),
    readed_at: new Date('2024-06-16T18:00:00.000Z'),
    tags: 'Fiction / Mystery & Detective / General, Fiction / Thrillers / General, Fiction / Crime, Fiction / Mystery & Detective / Traditional',
  },
  {
    id: 36,
    google_id: 'O2WuBAAACAAJ',
    title: 'Psycho II',
    thumbnail_url:
      'http://books.google.com/books/content?id=O2WuBAAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72AejPNyahyIURgQJ9jI9D6Y7dc4ndTd4kFPfHH9KScswiRp6X1eZW4x9IWnV2uyBR1g_1ss70NEqJripZqLB7WqouKtsht_H6faHWxH7NK9UjJZzp5l7-EMRG5uJR8146-H06u&source=gbs_api',
    authors: 'Robert Bloch',
    publish_date: '2003',
    is_readed: true,
    page_count: 224,
    inserted_at: new Date('2025-01-19T01:53:31.144Z'),
    readed_at: new Date('2025-01-20T18:00:00.000Z'),
    tags: 'Fiction / Horror',
  },
  {
    id: 32,
    google_id: 'A2bRDwAAQBAJ',
    title: 'Recursion',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=A2bRDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70hFHCLSbQvNtNTkkzpaCR3Jf2OpjH5GHAqyy5G1z8-uOfEQidcH8426rIMMiJ-dQrC4-h7XrUH24qJiar61DsiSlcrAxtd4gcmXKmVJeLWhNxfkNF_LgGzBgIDcWYrx_dRlhvL&source=gbs_api',
    authors: 'Blake Crouch',
    publish_date: '03/10/2020',
    is_readed: true,
    page_count: 336,
    inserted_at: new Date('2025-01-03T13:33:08.063Z'),
    readed_at: new Date('2024-12-16T18:00:00.000Z'),
    tags: 'Fiction / Thrillers / Technological, Fiction / Thrillers / Suspense, Fiction / Science Fiction / Action & Adventure',
  },
  {
    id: 15,
    google_id: 'VIeRKQEACAAJ',
    title: 'Sobre héroes y tumbas',
    thumbnail_url:
      'http://books.google.com/books/content?id=VIeRKQEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71fXPV3obZkTUmv1J4HvdX94ULFT_VXiW5I5dqmHanPhHqb4gmhiTBEMroJNKmHTZu5AdyWODGvGL67QM9TDGvh2tm5rjfFCJ76UUNwUk54NvmtsfRZ9IzojJ8k8nBez6rINzaB&source=gbs_api',
    authors: 'Ernesto Sábato',
    publish_date: '2011',
    is_readed: true,
    page_count: 544,
    inserted_at: new Date('2024-12-09T15:46:16.177Z'),
    readed_at: new Date('2024-11-08T18:00:00.000Z'),
    tags: 'Fiction / General, Literary Criticism / Ancient & Classical',
  },
  {
    id: 10,
    google_id: 'YpvEEAAAQBAJ',
    title: 'The Order of the Furies',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=YpvEEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71FG4HNa7Um5b2HFkuO7PCV0yyedsDHETrNsaH2rs9wV76HQHLtX-HZH6pSfCgaePFh5vwM9WbGB6TKyfTPObjk_OeYwsILiRZ7_eaqPxhVcZBfJ8VNxB3t6KUQhrh45QAS5LLL&source=gbs_api',
    authors: 'Niklas Natt och Dag',
    publish_date: '04/30/2024',
    is_readed: true,
    page_count: 400,
    inserted_at: new Date('2024-12-09T15:03:57.047Z'),
    readed_at: new Date('2024-04-25T18:00:00.000Z'),
    tags: 'Fiction / Crime, Fiction / Historical / General, Fiction / Thrillers / Crime',
  },
  {
    id: 23,
    google_id: 'xpdPEAAAQBAJ',
    title: 'The Truth About the Harry Quebert Affair',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=xpdPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72YiQKKzc2TiPLknNJhzB52GQp0dQ-XxQso9qox6Ogb2iSj_6TiAXkXNsZYHra1E19YGDKYtda1ynCltkeN7yvVu0QMs6xasuUWhZVFo_0WyX6x51EEJf7WFpXidl10VKeTUuzG&source=gbs_api',
    authors: 'Joel Dicker',
    publish_date: '05/27/2014',
    is_readed: true,
    page_count: 656,
    inserted_at: new Date('2024-12-16T23:23:03.435Z'),
    readed_at: new Date('2024-12-25T18:00:00.000Z'),
    tags: 'Fiction / Thrillers / Suspense, Fiction / Crime, Fiction / Mystery & Detective / Amateur Sleuth',
  },
  {
    id: 31,
    google_id: '9Xn_DwAAQBAJ',
    title: '¿Sueñan los androides con ovejas eléctricas?',
    thumbnail_url:
      'http://books.google.com/books/publisher/content?id=9Xn_DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE7149NEuKPgUrvQpqki8GDOH91ENE3FY7xo_eFAK6bGiwE5EVzGBU4smcbHPwzniwny-tPVZcSCoG31gyiTdzrjy4Ak8lgZsqOP4t3-Ucfj48sx_hxIZj6uBLuZU8qlR3GLRk8St&source=gbs_api',
    authors: 'Philip K. Dick',
    publish_date: '29/10/2020',
    is_readed: true,
    page_count: 272,
    inserted_at: new Date('2024-12-31T11:57:33.918Z'),
    readed_at: new Date('2024-03-16T18:00:00.000Z'),
    tags: 'Fiction / Science Fiction / General',
  },
];

function Page() {
  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          My Reading stats
        </h1>
        <ChartBar />
      </header>
      <section className='px-4'>
        <Carousel className='w-full'>
          <CarouselContent className='-ml-1'>
            <div className='pr-1'>
              <CarouselItem className='pl-1'>
                <Card className='w-[250px]'>
                  <CardHeader className='p-4'>
                    <div className='flex items-center justify-between'>
                      <CardTitle>Books readed</CardTitle>
                      <Book />
                    </div>
                  </CardHeader>
                  <CardContent className='px-4 pb-2'>
                    <span className='text-2xl font-bold'>21</span>
                  </CardContent>
                  <CardFooter className='pb-0'>
                    <span className='text-xs text-gray-400 pb-4 truncate'>
                      Last book readed: The truth about the Harry Quebert affair
                    </span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            </div>
            <div className='pr-1'>
              <CarouselItem className='pl-1'>
                <Card className='w-[250px]'>
                  <CardHeader className='p-4'>
                    <div className='flex items-center justify-between'>
                      <CardTitle>Page count</CardTitle>
                      <BookOpen />
                    </div>
                  </CardHeader>
                  <CardContent className='px-4 pb-2'>
                    <span className='text-2xl font-bold'>+8645</span>
                  </CardContent>
                  <CardFooter className='pb-0'>
                    <span className='text-xs text-gray-400 pb-4'>
                      640 pages last month
                    </span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            </div>
            <div className='pr-1'>
              <CarouselItem className='pl-1'>
                <Card className='w-[250px]'>
                  <CardHeader className='p-4'>
                    <div className='flex items-center justify-between'>
                      <CardTitle>Tags count</CardTitle>
                      <Tag />
                    </div>
                  </CardHeader>
                  <CardContent className='px-4 pb-2'>
                    <span className='text-2xl font-bold'>18</span>
                  </CardContent>
                  <CardFooter className='pb-0'>
                    <span className='text-xs text-gray-400 pb-4'>
                      Last tag readed Fiction
                    </span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            </div>
          </CarouselContent>
        </Carousel>
      </section>
      <section className='p-4'>
        <Card>
          <CardHeader>
            <CardTitle>Books Readed</CardTitle>
            <CardDescription>July 2024 - January 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout='vertical'
                margin={{
                  left: -20,
                }}
              >
                <XAxis type='number' dataKey='desktop' hide />
                <YAxis
                  dataKey='month'
                  type='category'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey='desktop' fill='var(--color-desktop)' radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className='flex-col items-start gap-2 text-sm'>
            <div className='flex gap-2 font-medium leading-none'>
              4.16 books readed peer month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='leading-none text-muted-foreground'>
              Total books readed last 6 months: 25
            </div>
          </CardFooter>
        </Card>
      </section>
      <section className='p-4'>
        <ShowAll label='Last reads' readStatus='readed' />
        <BooksList
          books={recentBooks.slice(16, 21)}
          opts={{ dragFree: true }}
        />
      </section>
    </div>
  );
}

export default Page;
