import { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  isPlaying: boolean;
}

export default function SnakeGame({ onScoreUpdate, isPlaying }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || !isPlaying) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, score, onScoreUpdate, generateFood, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#22c55e' : '#16a34a'; // green-500, green-600
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22c55e';
      ctx.fillRect(p.x * cellSize + 1, p.y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0;
    });

    // Draw Food
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="rounded-lg border-2 border-slate-800 shadow-[0_0_20px_rgba(30,41,59,0.3)] bg-slate-900"
        id="snake-canvas"
      />
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-lg border border-red-500/30">
          <h2 className="text-4xl font-bold text-red-500 tracking-tighter mb-2 animate-pulse">GAME OVER</h2>
          <p className="text-slate-400 mb-6 font-mono">FINAL SCORE: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            id="reset-btn"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-lg">
          <p className="text-white/60 font-mono text-sm animate-pulse">PAUSED</p>
        </div>
      )}
    </div>
  );
}
