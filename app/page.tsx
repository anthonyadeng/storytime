'use client';
import ReactMarkdown from 'react-markdown';
import markdownContent from '../content/story.md';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from './components/ThemeContext';
import Draggable from './components/scrollbar';
import { GradientGenerator } from './components/GradientGenerator';
import { debounce, throttle } from 'lodash';
export default function Home() {
  const { theme, scrollPos, setCurrScrollPos } = useTheme();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: scrollHeight * scrollPos,
      behavior: 'auto',
    });
  }, [scrollHeight, scrollPos]);

  const updateScrollSize = useCallback(() => {
    const newScrollHeight = document.documentElement.scrollHeight;
    const newScrollWidth = document.documentElement.clientWidth;

    if (newScrollHeight !== scrollHeight) {
      setScrollHeight(newScrollHeight);
    }
    if (newScrollWidth !== scrollWidth) {
      setScrollWidth(newScrollWidth);
    }
  }, [scrollHeight, scrollWidth]);

  const throttledUpdateScrollSize = useMemo(
    () => debounce(updateScrollSize, 100),
    [updateScrollSize]
  );
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.deltaY < 0) {
        setCurrScrollPos(Math.max(0, scrollPos - 0.01));
      } else if (event.deltaY > 0) {
        setCurrScrollPos(Math.min(1, scrollPos + 0.01));
      }
    },
    [scrollPos, setCurrScrollPos]
  );

  const throttledHandleWheel = useMemo(() => throttle(handleWheel, 100), []);
  useEffect(() => {
    throttledUpdateScrollSize();

    window.addEventListener('resize', throttledUpdateScrollSize);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('resize', throttledUpdateScrollSize);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, throttledUpdateScrollSize]);
  return (
    <main
      className={`${theme} overflow-hidden  flex min-h-screen flex-col items-center justify-between p-24`}
      ref={targetRef}
    >
      <Draggable />
      <GradientGenerator
        screenHeight={scrollHeight}
        screenWidth={scrollWidth}
        numberOf={Math.floor(scrollHeight / 500)}
      />
      {/* <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm  '>
        <p className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit '>
          hhh
          <code className='font-mono font-bold'> feaw</code>
        </p>
        <div className='fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black'>
          fff
        </div>
      </div> */}
      <div className='fixed bottom-0 right-0 px-10 py-5 '></div>
      <div className='relative z-[-1] flex place-items-center before:absolute  before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""] after:absolute after:-z-20 after:h-[180px]  after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[""] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-rose-400 before:dark:opacity-50 after:dark:from-sky-900 after:dark:via-[#0141ffe0] after:dark:opacity-40 before:w-96 after:w-40 before:h-screen'></div>
      <div className='fixed bottom-0 right-0 z-[-1]  place-items-center before:absolute  before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""] after:absolute after:-z-20 after:h-[180px]  after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[""] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-rose-400 before:dark:opacity-50 after:dark:from-sky-900 after:dark:via-[#0141ffe0] after:dark:opacity-40 before:w-96 after:w-40 before:h-screen'></div>
      <div className='flex relative min-h-screen flex-col'>
        <div className='group w-screen flex justify-start items-center'>
          <div className='blur-lg h-1 relative inline-block duration-1000 transition-all rounded-full my-20 py-2 w-1/2 before:absolute before:inset-0 before:bg-gradient-radial-1and2 before:from-white before:via-transparent before:to-transparent before:content-[""] before:rounded-xl after:absolute after:inset-0 after:top-0 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/4 after:bg-gradient-radial-1and2 after:from-[#ffffff] after:via-transparent after:to-transparent after:content-[""] after:rounded-full group-hover:scale-x-100 group-hover:opacity-60 group-hover:blur-xl motion-reduce:transform-none'></div>
        </div>
        <div className='group w-screen flex justify-end items-center'>
          <div className='blur-lg h-1 relative block duration-1000 transition-all rounded-full  my-20 py-2  w-1/2 before:absolute before:inset-0 before:bg-gradient-radial-1and2 before:from-white before:via-transparent before:to-transparent before:content-[""] before:rounded-xl after:absolute after:inset-0 after:top-0 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/4 after:bg-gradient-radial-1and2 after:from-[#ffffff] after:via-transparent after:to-transparent after:content-[""] after:rounded-full group-hover:scale-x-200 group-hover:opacity-40 group-hover:blur-xl motion-reduce:transform-none'></div>
        </div>{' '}
        <div className='group w-screen flex justify-center items-center'>
          <div className='blur-lg h-1 relative block duration-1000 transition-all rounded-full  my-24 py-2  w-1/2 before:absolute before:inset-0 before:bg-gradient-radial-1and2 before:from-white before:via-transparent before:to-transparent before:content-[""] before:rounded-xl after:absolute after:inset-0 after:top-0 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/4 after:bg-gradient-radial-1and2 after:from-[#ffffff] after:via-transparent after:to-transparent after:content-[""] after:rounded-full group-hover:scale-x-300 group-hover:opacity-40 group-hover:blur-xl motion-reduce:transform-none'></div>
        </div>
      </div>{' '}
      <div className='absolute w-full max-w-4xl p-24 rounded-lg pointer-events-none no-scrollbar'>
        <div className='markdown font-serif'>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
