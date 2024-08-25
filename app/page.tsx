'use client';
import ReactMarkdown from 'react-markdown';
import markdownContent from '../content/story.md';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGlobalContext } from './components/ThemeContext';
import Draggable from './components/scrollbar';

import { GradientGenerator } from './components/GradientGenerator';
import { debounce, throttle } from 'lodash';
export default function Home() {
  const { colorMode, toggleColorMode, scrollPos, setCurrScrollPos } =
    useGlobalContext();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const targetRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   console.log('scrollPos', scrollPos, scrollHeight);
  //   window.scrollTo({
  //     top: scrollHeight * scrollPos,
  //     behavior: 'auto',
  //   });
  // }, [scrollHeight, scrollPos]);

  const updateScrollSize = useCallback(() => {
    if (targetRef.current === null) return;
    const newScrollHeight = targetRef.current.scrollHeight;
    const newScrollWidth = document.documentElement.clientWidth;
    setScrollHeight(newScrollHeight);
    if (newScrollWidth !== scrollWidth) {
      setScrollWidth(newScrollWidth);
    }
  }, [scrollWidth]);

  // const handleWheel = useCallback(
  //   (event: WheelEvent) => {
  //     if (event.deltaY < 0) {
  //       setCurrScrollPos( document.getElementsByTagName('main')[0].scrollHeight);
  //     } else if (event.deltaY > 0) {
  //       setCurrScrollPos(Math.min(1, Math.max(0, scrollPos + 0.01)));
  //     }
  //   },
  //   [scrollPos, setCurrScrollPos]
  // );

  // const throttledHandleWheel = useMemo(
  //   () => throttle(handleWheel, 100),
  //   [handleWheel]
  // );
  const handleScroll = useCallback(() => {
    if (targetRef.current === null) return;
    const newScrollPos = targetRef.current.scrollTop / scrollHeight;
    setCurrScrollPos(newScrollPos);
  }, [scrollHeight, setCurrScrollPos]);

  useEffect(() => {
    if (targetRef.current === null) return;
    const mainRef = targetRef.current;
    updateScrollSize();
    mainRef.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateScrollSize);
    // window.addEventListener('wheel', throttledHandleWheel);

    return () => {
      window.removeEventListener('resize', updateScrollSize);
      mainRef.removeEventListener('scroll', handleScroll);
      // window.removeEventListener('wheel', throttledHandleWheel);
    };
  }, [handleScroll, updateScrollSize]);
  useEffect(() => {
    if (colorMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [colorMode]);
  return (
    <main
      className=' relative overflow-y-auto overflow-x-hidden no-scrollbar h-screen flex flex-col items-center justify-between p-24 bg-zinc-100 text-red-500 dark:text-zinc-200 dark:bg-zinc-900 w-full'
      ref={targetRef}
    >
      aaa
      <Draggable />
      <GradientGenerator
        screenHeight={scrollHeight}
        screenWidth={scrollWidth}
        numberOf={12}
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
      <div className='fixed bottom-0 right-0 px-10 py-5 '>aaa</div>
      <div className='relative z-[0] flex place-items-center before:absolute  before:-translate-x-1/2 before:rounded-full    before:blur-2xl before:content-[""] after:absolute after:h-[180px]  after:translate-x-1/3 after:bg-gradient-conic after:blur-2xl after:content-[""] before:bg-gradient-to-br before:from-transparent before:to-rose-400 before:opacity-50 after:from-sky-900 after:via-[#0141ffe0] after:dark:opacity-40 before:w-96 after:w-40 before:h-screen'></div>
      <div className='fixed bottom-0 right-0 z-[-1]  place-items-center before:absolute  before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[""] after:absolute after:-z-20 after:h-[180px]  after:translate-x-1/3 after:bg-gradient-conic   after:blur-2xl after:content-[""] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-rose-400 before:opacity-50 after:from-sky-900 after:via-[#0141ffe0] after:opacity-40 before:w-96 after:w-40 before:h-screen'></div>
      <div className='flex relative min-h-screen flex-col'>
        <div className='group w-screen flex justify-start items-center'>
          <div id='whitestripe'></div>
        </div>
        <div className='group w-screen flex justify-end items-center'>
          <div id='whitestripe'></div>
        </div>{' '}
        <div className='group w-screen flex justify-center items-center'>
          <div id='whitestripe'></div>
        </div>
      </div>{' '}
      <div className='absolute p-24 px-72 w-full pointer-events-none'>
        <div className='markdown font-serif max-w-full max-h-full overflow-y-auto overflow-x-hidden'>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
