import { useState, useEffect, useRef } from 'react';

// Game constants
const TILE_SIZE = 20;
const PACMAN_RADIUS = TILE_SIZE / 2 - 2;
const PACMAN_SPEED_MS = 150;

// Map legend: 1 = wall, 0 = pellet, 2 = empty path
const initialMapLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,2,1,1,0,1,0,1,1,1,1], // 2 is ghost house area
    [2,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,2], // row 10 is the tunnel
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_WIDTH = initialMapLayout[0].length * TILE_SIZE;
const MAP_HEIGHT = initialMapLayout.length * TILE_SIZE;

type Position = { x: number; y: number };
type Direction = 'Up' | 'Down' | 'Left' | 'Right' | 'Stop';
type Ghost = {
  pos: Position;
  dir: Direction;
  color: string;
};

const initialGhosts: Ghost[] = [
  { pos: { x: 9, y: 8 }, dir: 'Up', color: '#ff0000' },   // Blinky (red)
  { pos: { x: 8, y: 10 }, dir: 'Up', color: '#ffb8ff' }, // Pinky (pink)
  { pos: { x: 10, y: 10 }, dir: 'Up', color: '#00ffff' },// Inky (cyan)
  { pos: { x: 9, y: 10 }, dir: 'Up', color: '#ffb852' }, // Clyde (orange)
];


export const usePacmanGame = (canvasRef: React.RefObject<HTMLCanvasElement>, onExit: () => void) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const map = useRef(JSON.parse(JSON.stringify(initialMapLayout)));
  const initialPellets = initialMapLayout.flat().filter(tile => tile === 0).length;
  const [pelletsRemaining, setPelletsRemaining] = useState(initialPellets);
  
  const pacman = useRef<Position>({ x: 1, y: 1 });
  const direction = useRef<Direction>('Stop');
  const nextDirection = useRef<Direction>('Stop');
  const ghosts = useRef<Ghost[]>(JSON.parse(JSON.stringify(initialGhosts)));

  const setNextDirection = (dir: Direction) => {
    if (gameOver) return;
    nextDirection.current = dir;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'q' || e.key === 'Escape') {
        onExit();
        return;
      }
      if (gameOver) return;

      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': setNextDirection('Up'); break;
        case 'ArrowDown': setNextDirection('Down'); break;
        case 'ArrowLeft': setNextDirection('Left'); break;
        case 'ArrowRight': setNextDirection('Right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (gameOver) return;

    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;
    
    const canMove = (x: number, y: number): boolean => {
      // Allow moving into tunnels
      if (y === 10 && (x < 0 || x >= map.current[0].length)) {
          return true;
      }
      const tile = map.current[y]?.[x];
      // Can't move if out of bounds (unless it's a tunnel) or into a wall
      return tile !== undefined && tile !== 1;
    };

    const moveGhosts = () => {
      ghosts.current.forEach(ghost => {
        const options: Direction[] = [];
        const { x, y } = ghost.pos;
        const opposites: Record<Direction, Direction> = { 'Up': 'Down', 'Down': 'Up', 'Left': 'Right', 'Right': 'Left', 'Stop': 'Stop' };

        // Check possible moves
        if (canMove(x, y - 1)) options.push('Up');
        if (canMove(x, y + 1)) options.push('Down');
        if (canMove(x - 1, y)) options.push('Left');
        if (canMove(x + 1, y)) options.push('Right');

        let validOptions = options;
        if (options.length > 1) {
          validOptions = options.filter(opt => opt !== opposites[ghost.dir]);
        }

        if (validOptions.length > 0) {
          // Simple chase logic: move towards pacman
          const pacmanPos = pacman.current;
          let bestOption: Direction = validOptions[0];
          let minDistance = Infinity;

          validOptions.forEach(option => {
            let nextX = x, nextY = y;
            if (option === 'Up') nextY--;
            if (option === 'Down') nextY++;
            if (option === 'Left') nextX--;
            if (option === 'Right') nextX++;

            const distance = Math.hypot(pacmanPos.x - nextX, pacmanPos.y - nextY);
            if (distance < minDistance) {
              minDistance = distance;
              bestOption = option;
            }
          });
          
          ghost.dir = bestOption;
        } else if (options.length > 0) {
          ghost.dir = options[0]; // Must turn back
        }

        // Move ghost
        if (ghost.dir === 'Up') ghost.pos.y--;
        else if (ghost.dir === 'Down') ghost.pos.y++;
        else if (ghost.dir === 'Left') ghost.pos.x--;
        else if (ghost.dir === 'Right') ghost.pos.x++;

        // Ghost tunnel travel
        if (ghost.pos.y === 10) {
            if (ghost.pos.x < 0) ghost.pos.x = map.current[0].length - 1;
            else if (ghost.pos.x >= map.current[0].length) ghost.pos.x = 0;
        }
      });
    };

    const update = () => {
      const pos = pacman.current;

      let nextPosCheck = { ...pos };
      if (nextDirection.current === 'Up') nextPosCheck.y--;
      else if (nextDirection.current === 'Down') nextPosCheck.y++;
      else if (nextDirection.current === 'Left') nextPosCheck.x--;
      else if (nextDirection.current === 'Right') nextPosCheck.x++;
      if (canMove(nextPosCheck.x, nextPosCheck.y)) {
        direction.current = nextDirection.current;
      }

      let currentPos = { ...pos };
      if (direction.current === 'Up') currentPos.y--;
      else if (direction.current === 'Down') currentPos.y++;
      else if (direction.current === 'Left') currentPos.x--;
      else if (direction.current === 'Right') currentPos.x++;

      if (canMove(currentPos.x, currentPos.y)) {
        pacman.current = currentPos;
      }

      // Pacman Tunnel Travel
      if (pacman.current.y === 10) {
        if (pacman.current.x < 0) pacman.current.x = map.current[0].length - 1;
        else if (pacman.current.x >= map.current[0].length) pacman.current.x = 0;
      }

      if (map.current[pacman.current.y][pacman.current.x] === 0) {
        map.current[pacman.current.y][pacman.current.x] = 2; // Mark as eaten
        const newScore = score + 10;
        const newPelletsRemaining = pelletsRemaining - 1;
        setScore(newScore);
        setPelletsRemaining(newPelletsRemaining);
        if (newPelletsRemaining === 0) {
          setGameOver(true);
        }
      }

      moveGhosts();

      // Collision with ghosts
      ghosts.current.forEach(ghost => {
        if (ghost.pos.x === pacman.current.x && ghost.pos.y === pacman.current.y) {
          setGameOver(true);
        }
      });
    };

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      
      for (let y = 0; y < map.current.length; y++) {
        for (let x = 0; x < map.current[y].length; x++) {
          if (map.current[y][x] === 1) {
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (map.current[y][x] === 0) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 2, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      // Draw Ghosts
      ghosts.current.forEach(ghost => {
        const { x, y } = ghost.pos;
        const gx = x * TILE_SIZE;
        const gy = y * TILE_SIZE;
        const r = TILE_SIZE / 2;

        ctx.fillStyle = ghost.color;
        // Body
        ctx.beginPath();
        ctx.arc(gx + r, gy + r, r, Math.PI, 0);
        ctx.lineTo(gx + TILE_SIZE, gy + TILE_SIZE);
        ctx.lineTo(gx + (TILE_SIZE * 0.8), gy + (TILE_SIZE * 0.8));
        ctx.lineTo(gx + (TILE_SIZE * 0.6), gy + TILE_SIZE);
        ctx.lineTo(gx + (TILE_SIZE * 0.4), gy + (TILE_SIZE * 0.8));
        ctx.lineTo(gx + (TILE_SIZE * 0.2), gy + TILE_SIZE);
        ctx.lineTo(gx, gy + TILE_SIZE);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(gx + r - 4, gy + r - 2, 3, 0, 2 * Math.PI); // Left eye
        ctx.arc(gx + r + 4, gy + r - 2, 3, 0, 2 * Math.PI); // Right eye
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(gx + r - 4, gy + r - 2, 1.5, 0, 2 * Math.PI); // Left pupil
        ctx.arc(gx + r + 4, gy + r - 2, 1.5, 0, 2 * Math.PI); // Right pupil
        ctx.fill();
      });

      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      let startAngle = 0.25 * Math.PI, endAngle = 1.75 * Math.PI;

      if (direction.current === 'Right') { /* default */ } 
      else if (direction.current === 'Left') { startAngle += Math.PI; endAngle += Math.PI; } 
      else if (direction.current === 'Up') { startAngle -= Math.PI / 2; endAngle -= Math.PI / 2; } 
      else if (direction.current === 'Down') { startAngle += Math.PI / 2; endAngle += Math.PI / 2; }
      if (direction.current === 'Stop') { startAngle = 0; endAngle = 2 * Math.PI; }

      ctx.arc(pacman.current.x * TILE_SIZE + TILE_SIZE / 2, pacman.current.y * TILE_SIZE + TILE_SIZE / 2, PACMAN_RADIUS, startAngle, endAngle);
      ctx.lineTo(pacman.current.x * TILE_SIZE + TILE_SIZE / 2, pacman.current.y * TILE_SIZE + TILE_SIZE / 2);
      ctx.fill();
    };
    
    let animationFrameId: number;
    let lastUpdateTime = 0;
    
    const gameLoop = (timestamp: number) => {
      if (lastUpdateTime === 0) {
        lastUpdateTime = timestamp;
      }

      const elapsed = timestamp - lastUpdateTime;
      if (elapsed > PACMAN_SPEED_MS) {
        update();
        lastUpdateTime = timestamp;
      }
      
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, gameOver]);

  return { score, gameOver, pelletsRemaining, setNextDirection };
};
