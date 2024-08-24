import { over } from 'lodash';
import { useEffect, useCallback, useState } from 'react';

interface GradientProps {
  screenYPos: number;
  screenXPos: number;
  height: number;
  width: number;
  color1: string;
  color2?: string;
  type: 'radial' | 'linear' | 'conic';
}

const Gradient: React.FC<GradientProps> = ({
  screenYPos,
  screenXPos,
  height,
  width,
  color1,
  color2 = 'transparent',
  type,
}) => {
  const gradientStyle =
    type === 'radial'
      ? `radial-gradient(closest-side, ${color1}, ${color2}, transparent)`
      : type === 'linear'
      ? `linear-gradient(${color1}, ${color2}, transparent)`
      : `conic-gradient(${color1}, ${color2}, transparent)`;

  const style = {
    position: 'absolute' as 'absolute',
    zIndex: 55,
    top: `${screenYPos}px`,
    left: `${screenXPos}px`,
    width: `${width}px`,
    height: `${height}px`,
    background: gradientStyle,
  };

  return (
    <div className='blur-2xl opacity-30 rounded-full ' style={style}>
      FD
    </div>
  );
};

interface GradientGeneratorProps {
  screenHeight: number;
  screenWidth: number;
  numberOf: number;
}

export const GradientGenerator: React.FC<GradientGeneratorProps> = ({
  screenHeight,
  screenWidth,
  numberOf,
}) => {
  const [gradients, setGradients] = useState<JSX.Element[]>([]);
  const generateHexWithAlpha = useCallback(() => {
    const hex = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    const alpha = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${alpha}`;
  }, []);
  useEffect(() => {
    const newGradients = [];
    for (let i = 0; i < numberOf; i++) {
      let screenYPos = Math.floor(Math.random() * screenHeight);
      let screenXPos = Math.floor(Math.random() * screenWidth);
      let height = Math.floor(Math.random() * 1000 + 250); // Random size between 50 and 150
      let width = Math.floor(Math.random() * 1000 + 250); // Random size between 50 and 150
      //generate hex with alpha
      // Ensure the gradient does not extend past the scrollHeight
      if (screenYPos + height > screenHeight) {
        height = screenHeight - screenYPos - 500;
      }

      // Ensure the gradient does not extend past the scrollWidth
      if (screenXPos + width > screenWidth) {
        width = screenWidth - screenXPos;
      }
      const color1 = generateHexWithAlpha();
      const color2 = generateHexWithAlpha();
      const randNumb = Math.random();
      const type =
        randNumb < 0.33 ? 'radial' : randNumb < 0.66 ? 'conic' : 'linear';

      newGradients.push(
        <Gradient
          key={i + randNumb + color1 + color2}
          screenYPos={screenYPos}
          screenXPos={screenXPos}
          height={height}
          width={width}
          color1={color1}
          color2={color2}
          type={type}
        />
      );
    }
    setGradients(newGradients);
  }, [screenHeight, screenWidth, numberOf, generateHexWithAlpha]);

  return <div className='absolute w-full h-full'>{gradients} FFFFFFFFFF</div>;
};
