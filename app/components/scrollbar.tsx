import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useGlobalContext } from './ThemeContext';
import { throttle } from 'lodash';
import Image from 'next/image';
const Scrollbar = () => {
  const { toggleColorMode, setCurrScrollPos, scrollPos } = useGlobalContext();
  const isDragging = useRef(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selfRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const speed = 0.5; // Speed in pixels per frame
  const maxDistance = 25;
  const animationFrameId = useRef<number | null>(null);
  const moveDiv = useCallback(() => {
    if (!isDragging.current) return;

    setPosition((prevPosition) => {
      if (selfRef.current == null) return { top: 0, left: 0 };
      const dx =
        cursorPositionRef.current.x -
        (selfRef.current.getBoundingClientRect().left +
          (selfRef.current?.offsetWidth || 0) / 2);
      const dy =
        cursorPositionRef.current.y -
        (selfRef.current.getBoundingClientRect().top +
          (selfRef.current?.offsetHeight || 0) / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        return prevPosition; // Stop moving if close enough
      }

      const angle = Math.atan2(dy, dx);
      const newLeft = prevPosition.left + Math.cos(angle) * speed;
      const newTop = prevPosition.top + Math.sin(angle) * speed;
      const offsetHeight = selfRef.current?.offsetHeight || 0;
      const offsetWidth = selfRef.current?.offsetWidth || 0;

      const currScrollPos = newTop / window.innerHeight;
      updateScrollTop(currScrollPos);
      return {
        top: currScrollPos * window.innerHeight,
        left: Math.max(0, Math.min(window.innerWidth - offsetWidth, newLeft)),
      };
    });
  }, []);

  const throttledMoveDiv = useMemo(() => throttle(moveDiv, 25), [moveDiv]);

  const throttledAnimationFrame = useCallback(() => {
    throttledMoveDiv();
    animationFrameId.current = requestAnimationFrame(throttledAnimationFrame);
  }, [throttledMoveDiv]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    cursorPositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      isDragging.current = false;
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    },
    [handleMouseMove]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      cursorPositionRef.current = { x: e.clientX, y: e.clientY };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      requestAnimationFrame(throttledAnimationFrame); // Start the animation loop
    },
    [handleMouseMove, handleMouseUp, throttledAnimationFrame]
  );
  const smoothScrollTo = useCallback((targetScrollPos: number) => {
    const mainElement = document.getElementsByTagName('main')[0];
    const startScrollPos = mainElement.scrollTop;
    const targetScrollTop = targetScrollPos * mainElement.scrollHeight;
    const duration = 300; // Duration in milliseconds
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeInOutQuad = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const interpolatedScrollTop =
        startScrollPos +
        (targetScrollTop - startScrollPos) * easeInOutQuad(progress);

      mainElement.scrollTop = interpolatedScrollTop;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    if (isDragging.current) return;
    const currHeight = window.innerHeight;
    console.log('scrollPos', scrollPos);
    setPosition((prevPosition) => {
      return {
        top: Math.min(
          currHeight - (selfRef.current?.offsetHeight || 0),
          scrollPos * currHeight
        ),
        left: prevPosition.left,
      };
    });
    return () => {};
  }, [scrollPos]);
  return (
    <div
      id='scrollbar'
      ref={selfRef}
      onMouseDown={handleMouseDown}
      onClick={toggleColorMode}
      className={`${!isDragging.current ? 'animated-position' : ''}`}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,

        zIndex: 100,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className='relative w-24 h-16'>
        <div className='absolute w-full h-full blur-sm opacity-70'>
          <Image
            layout='fill'
            objectFit='contain'
            src='/water.png'
            alt='logo'
          />
        </div>
        <div className='absolute w-full h-full blur-xsm opacity-40'>
          <Image
            layout='fill'
            objectFit='contain'
            src='/water.png'
            alt='logo'
          />
        </div>
        <div className='absolute w-full h-full blur-xxsm opacity-40'>
          <Image
            layout='fill'
            objectFit='contain'
            src='/water.png'
            alt='logo'
          />
        </div>
        <div className='absolute w-full h-full opacity-60'>
          <Image
            layout='fill'
            objectFit='contain'
            src='/water.png'
            alt='logo'
          />
        </div>
      </div>
    </div>
  );
};

export default Scrollbar;
