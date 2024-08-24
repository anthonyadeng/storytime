import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useTheme } from './ThemeContext';
import { throttle } from 'lodash';
import Image from 'next/image';
import { GradientGenerator } from './GradientGenerator';
const Scrollbar = () => {
  const { toggleTheme, setCurrScrollPos } = useTheme();
  const isDragging = useRef(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selfRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const speed = 0.25; // Speed in pixels per frame
  const maxDistance = 25;
  const animationFrameId = useRef<number | null>(null);
  const moveDiv = useCallback(() => {
    if (!isDragging.current) {
      return;
    }
    setPosition((prevPosition) => {
      const dx =
        cursorPositionRef.current.x -
        (prevPosition.left + (selfRef.current?.offsetWidth || 0) / 2);
      const dy =
        cursorPositionRef.current.y -
        (prevPosition.top + (selfRef.current?.offsetHeight || 0) / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        return prevPosition; // Stop moving if close enough
      }

      const angle = Math.atan2(dy, dx);
      const newLeft = prevPosition.left + Math.cos(angle) * speed;
      const newTop = prevPosition.top + Math.sin(angle) * speed;
      const offsetHeight = selfRef.current?.offsetHeight || 0;
      const offsetWidth = selfRef.current?.offsetWidth || 0;

      setCurrScrollPos(
        Math.max(0, Math.min(1, newTop / (window.innerHeight - offsetHeight)))
      );
      return {
        top: Math.max(0, Math.min(window.innerHeight - offsetHeight, newTop)),
        left: Math.max(0, Math.min(window.innerWidth - offsetWidth, newLeft)),
      };
    });
  }, [setCurrScrollPos]);

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
      console.log('mouseup');
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      isDragging.current = false;
      console.log(isDragging.current);
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
      console.log('mousedown');
      cursorPositionRef.current = { x: e.clientX, y: e.clientY };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      requestAnimationFrame(throttledAnimationFrame); // Start the animation loop
    },
    [handleMouseMove, handleMouseUp, throttledAnimationFrame]
  );

  return (
    <div
      id='scrollbar'
      ref={selfRef}
      onMouseDown={handleMouseDown}
      onClick={toggleTheme}
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
