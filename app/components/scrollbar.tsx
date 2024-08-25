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
  const scrollTo = useRef(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selfRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const windowHeightRef = useRef<number | null>(null);
  const latestTargetScrollTop = useRef<number | null>(0);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const minSpeed = 0.25;
  const maxSpeed = 1;
  const maxDistance = 15;
  const animationFrameId = useRef<number | null>(null);
  const animationFrameId2 = useRef<number | null>(null);
  const animationFrameIds = useRef<number[]>([]);
  const cancelAllAnimations = () => {
    animationFrameIds.current.forEach((id) => cancelAnimationFrame(id));
    animationFrameIds.current = [];
  };

  useEffect(() => {
    mainRef.current = document.getElementsByTagName(
      'main'
    )[0] as HTMLDivElement;
    windowHeightRef.current =
      window.innerHeight -
      (selfRef.current?.getBoundingClientRect().height || 0);
    console.log(
      'windowHeightRef',
      windowHeightRef.current,
      'windowHeight',
      window.innerHeight,
      'selfRef',
      selfRef.current?.getBoundingClientRect().height
    );
  }, []);

  const animateScroll = useCallback(() => {
    if (mainRef.current === null || latestTargetScrollTop.current === null) {
      return;
    }

    const currentScrollTop = mainRef.current.scrollTop;
    const targetScrollTop = latestTargetScrollTop.current;
    const distance = targetScrollTop - currentScrollTop;
    const speed = 0.5; // Adjust this value to control the speed of the interpolation

    // console.log('Current scroll top:', currentScrollTop);
    // console.log('Target scroll top:', targetScrollTop);
    // console.log('Distance:', distance);

    if (Math.abs(distance) >= 0.5) {
      mainRef.current.scrollTop = currentScrollTop + distance * speed;
      // console.log('Scrolling to:', mainRef.current.scrollTop);
    } else {
      // console.log('Reached target');
      mainRef.current.scrollTop = targetScrollTop;
      animationFrameId.current = null;
    }

    animationFrameId.current = requestAnimationFrame(animateScroll);
    animationFrameIds.current.push(animationFrameId.current);
  }, []);

  const animateScrollTo = useCallback(
    (newPos: number) => {
      // console.log('animateScrollTo called with newPos:', newPos);

      if (mainRef.current === null) {
        // console.log('mainRef is null');
        return;
      }

      latestTargetScrollTop.current = newPos * mainRef.current.scrollHeight;
      if (animationFrameId2.current === null) {
        animationFrameId2.current = requestAnimationFrame(animateScroll);
        animationFrameIds.current.push(animationFrameId2.current);
      }
    },
    [animateScroll]
  );
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
      const speed = Math.min(maxSpeed, Math.max(minSpeed, distance / 222));
      const newLeft = prevPosition.left + Math.cos(angle) * speed;
      const offsetHeight = selfRef.current?.offsetHeight || 0;
      const newTop = Math.min(
        0.9424 * windowHeightRef.current!,
        prevPosition.top + Math.sin(angle) * speed
      );
      const offsetWidth = selfRef.current?.offsetWidth || 0;
      console.log(
        'window.innerHeight',
        window.innerHeight,
        'windowheightref',
        windowHeightRef.current
      );
      const scrollcurr1 = newTop / windowHeightRef.current!;
      const scrollcurr2 = newTop / window.innerHeight;
      console.log('scrollCurr', scrollcurr1, 'scrollCurr2', scrollcurr1);
      scrollTo.current = Math.max(0, Math.min(1, scrollcurr1));
      animateScrollTo(scrollTo.current);

      return {
        top: scrollTo.current * windowHeightRef.current!,
        left: Math.max(0, Math.min(window.innerWidth - offsetWidth, newLeft)),
      };
    });
  }, [animateScrollTo]);

  const throttledMoveDiv = useMemo(() => throttle(moveDiv, 25), [moveDiv]);

  const throttledAnimationFrame = useCallback(() => {
    throttledMoveDiv();
    animationFrameId.current = requestAnimationFrame(throttledAnimationFrame);
    animationFrameIds.current.push(animationFrameId.current);
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
      if (animationFrameId2.current !== null) {
        cancelAnimationFrame(animationFrameId2.current);
      }
      animationFrameId.current = null;
      animationFrameId2.current = null;
      cancelAllAnimations();
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

  useEffect(() => {
    if (isDragging.current) return;
    const windowHeight = windowHeightRef.current!;
    console.log('scrollPos', scrollPos);
    setPosition((prevPosition) => {
      return {
        top: scrollPos * windowHeight,
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
