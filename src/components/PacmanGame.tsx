
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { usePacmanGame } from '@/hooks/usePacmanGame';

interface PacmanGameProps {
  onExit: () => void;
}

const PacmanGame: React.FC<PacmanGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { score, gameOver, pelletsRemaining, setNextDirection } = usePacmanGame(canvasRef, onExit);
  const [scale, setScale] = useState(1);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const gameWidth = 380; // From map width
        if (containerWidth < gameWidth + 40) { // Add some padding
          setScale(containerWidth / (gameWidth + 40));
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if(containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos.current) return;

    const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEndPos.x - touchStartPos.current.x;
    const dy = touchEndPos.y - touchStartPos.current.y;
    const swipeThreshold = 20;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > swipeThreshold) {
        setNextDirection(dx > 0 ? 'Right' : 'Left');
      }
    } else {
      if (Math.abs(dy) > swipeThreshold) {
        setNextDirection(dy > 0 ? 'Down' : 'Up');
      }
    }
    touchStartPos.current = null;
  };

  const winOrLoseMessage = pelletsRemaining === 0 ? 'You Win!' : 'Game Over!';

  return (
    <div 
      ref={containerRef}
      tabIndex={-1} 
      className="flex flex-col items-center justify-center h-full w-full text-center focus:outline-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}>
        <h1 className="text-2xl font-bold text-yellow-400 mb-2 animate-pulse">Pac-Man</h1>
        <div className="flex justify-between w-[380px] px-2 mb-2 font-mono">
          <p className="text-lg">Score: <span className="text-white">{score}</span></p>
          {gameOver && <p className="text-lg text-green-400 font-bold">{winOrLoseMessage}</p>}
        </div>
        <div className="bg-black p-1 rounded-lg border-2 border-blue-500 inline-block">
          <canvas ref={canvasRef} />
        </div>
      </div>
      
      <div className="absolute bottom-10 text-center w-full px-4">
        <p className="text-muted-foreground hidden sm:block">Use Arrow Keys to move.</p>
        <p className="text-muted-foreground sm:hidden">Swipe to move.</p>
        {gameOver && <p className="mt-2 text-yellow-400">Exit and run 'pacman' again to replay!</p>}
        <Button onClick={onExit} variant="ghost" className="mt-2 text-red-500 hover:bg-red-500/10 hover:text-red-500">
          Exit Game
        </Button>
      </div>
    </div>
  );
};

export default PacmanGame;
