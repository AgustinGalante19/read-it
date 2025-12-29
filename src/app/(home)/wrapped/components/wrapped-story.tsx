'use client';

import { useState, useEffect } from 'react';
import { YearlyRecap } from '@/types/Stats';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, BookOpen, Clock, Layers, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WrappedStoryProps {
  recap: YearlyRecap;
}

export default function WrappedStory({ recap }: WrappedStoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      id: 'intro',
      bg: 'bg-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white space-y-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="w-24 h-24 text-primary mb-4 text-purple-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            YOUR {recap.year}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              WRAPPED
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-400"
          >
            It was quite a chapter.
          </motion.p>
        </div>
      ),
    },
    {
      id: 'books-count',
      bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl md:text-9xl font-black mb-4 text-indigo-400"
          >
            {recap.totalBooks}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold"
          >
            Books Read
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-indigo-200 max-w-md"
          >
            You traveled through {recap.totalBooks} different worlds this year.
          </motion.p>
        </div>
      ),
    },
    {
      id: 'pages-count',
      bg: 'bg-gradient-to-br from-pink-900 via-rose-900 to-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center mb-8"
          >
            <Layers className="w-16 h-16 text-pink-400" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-6xl md:text-8xl font-black mb-2"
          >
            {recap.totalPages.toLocaleString()}
          </motion.div>
          <motion.h3 className="text-2xl font-semibold text-pink-200 uppercase tracking-widest">
            Pages Turned
          </motion.h3>
        </div>
      ),
    },
    recap.topGenres.length > 0 && {
      id: 'genres',
      bg: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white w-full max-w-2xl">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold mb-12"
          >
            Your Top Genres
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {recap.topGenres.map((genre, index) => (
              <motion.div
                key={genre.tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className={cn(
                  "rounded-full px-6 py-3 font-bold shadow-lg",
                  index === 0 ? "bg-white text-emerald-900 text-2xl" :
                    index === 1 ? "bg-emerald-200 text-emerald-900 text-xl" :
                      "bg-emerald-900/50 border border-emerald-500/30 text-emerald-100"
                )}
              >
                {genre.tag}
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-emerald-200/60"
          >
            You really dug into {recap.topGenres[0]?.tag}.
          </motion.p>
        </div>
      ),
    },
    recap.mostActiveMonth && {
      id: 'active-month',
      bg: 'bg-gradient-to-tr from-orange-900 via-amber-900 to-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white space-y-8">
          <Calendar className="w-20 h-20 text-orange-400" />
          <div>
            <motion.div
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-7xl font-black text-orange-100 mb-2"
            >
              {recap.mostActiveMonth.month}
            </motion.div>
            <p className="text-orange-300 text-xl">Was your busiest month</p>
          </div>
          <div className="text-lg bg-orange-900/30 px-6 py-2 rounded-full border border-orange-500/20">
            {recap.mostActiveMonth.count} books finished
          </div>
        </div>
      )
    },
    recap.longestBook && {
      id: 'longest-book',
      bg: 'bg-gradient-to-bl from-blue-900 via-cyan-900 to-black',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white max-w-3xl">
          <Trophy className="w-16 h-16 text-yellow-400 mb-8" />
          <h2 className="text-2xl text-blue-200 mb-4">The Longest Journey</h2>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 w-full"
          >
            {recap.longestBook?.thumbnail_url && (
              <img
                src={recap.longestBook.thumbnail_url}
                alt={recap.longestBook.title}
                className="w-32 h-auto mx-auto mb-4 rounded shadow-2xl"
              />
            )}
            <h3 className="text-xl md:text-3xl font-bold mb-2">{recap.longestBook?.title}</h3>
            <p className="text-blue-300">{recap.longestBook?.page_count} pages</p>
          </motion.div>
        </div>
      )
    },
    {
      id: "summary",
      bg: "bg-gradient-to-r from-violet-600 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-white/90">
              {recap.year} in Review
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-violet-300">
                  {recap.totalBooks}
                </div>
                <div className="text-xs uppercase opacity-70">Books Read</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-pink-300">
                  {recap.totalPages.toLocaleString()}
                </div>
                <div className="text-xs uppercase opacity-70">Pages Read</div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              {recap.topGenres.length > 0 && (
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="opacity-70">Top Genre</span>
                  <span className="font-semibold text-emerald-300">
                    {recap.topGenres[0]?.tag}
                  </span>
                </div>
              )}
              {recap.mostActiveMonth && (
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="opacity-70">Busiest Month</span>
                  <span className="font-semibold text-orange-300">
                    {recap.mostActiveMonth.month}
                  </span>
                </div>
              )}
              {recap.longestBook && (
                <div className="flex justify-between items-center pb-2">
                  <span className="opacity-70">Longest Book</span>
                  <span className="font-semibold text-blue-300 truncate max-w-[150px] text-right">
                    {recap.longestBook.title}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <Link href="/stats">
            <Button
              variant="secondary"
              size="lg"
              className="font-bold shadow-lg mt-4"
            >
              See detailed stats
            </Button>
          </Link>
        </div>
      ),
    }
  ].filter(Boolean) as { id: string; bg: string; content: React.ReactNode }[];

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <Link
        href="/"
        className="absolute top-4 right-4 z-50 text-white/50 hover:text-white transition-colors"
      >
        <X size={24} />
      </Link>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex h-1.5 gap-1 p-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-full flex-1 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: index <= currentSlide ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={{
            enter: (direction: number) => ({
              x: direction > 0 ? 1000 : -1000,
              opacity: 0,
            }),
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
            },
            exit: (direction: number) => ({
              zIndex: 0,
              x: direction < 0 ? 1000 : -1000,
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className={cn(
            "absolute inset-0 w-full h-full",
            slides[currentSlide].bg
          )}
          onClick={(e) => {
            // Click right side to go next, left to go prev (Instagram story style)
            const width = e.currentTarget.clientWidth;
            const clickX = e.clientX;
            if (clickX > width / 2) {
              nextSlide();
            } else {
              prevSlide();
            }
          }}
        >
          {slides[currentSlide].content}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 md:hidden z-50 text-white/50">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); prevSlide(); }} disabled={currentSlide === 0}>
          <ChevronLeft />
        </Button>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); nextSlide(); }} disabled={currentSlide === slides.length - 1}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
