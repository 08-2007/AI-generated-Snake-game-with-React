import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, RefreshCw } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#00ffff11';
    ctx.lineWidth = 1;
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

    // Draw food (Magenta Glitch)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw snake (Cyan Glitch)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00ffffaa';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 font-mono">
      <div className="grid grid-cols-2 gap-4 w-full px-2">
        <div className="border border-[#00ffff]/30 p-2 bg-[#00ffff]/5">
          <p className="text-[10px] text-[#00ffff]/60 uppercase tracking-widest">DATA_POINTS</p>
          <p className="text-2xl font-pixel text-[#00ffff]">{score.toString().padStart(6, '0')}</p>
        </div>
        <div className="border border-[#ff00ff]/30 p-2 bg-[#ff00ff]/5 text-right">
          <p className="text-[10px] text-[#ff00ff]/60 uppercase tracking-widest">MAX_INTEGRITY</p>
          <p className="text-2xl font-pixel text-[#ff00ff]">{highScore.toString().padStart(6, '0')}</p>
        </div>
      </div>

      <div className="relative border-2 border-[#00ffff]/20 p-1 bg-[#00ffff]/5">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-pixel text-[#ff00ff] glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                  <button
                    onClick={resetGame}
                    className="group relative px-8 py-2 bg-transparent border-2 border-[#ff00ff] text-[#ff00ff] font-pixel text-xl hover:bg-[#ff00ff] hover:text-black transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      REBOOT_SYSTEM
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-pixel text-[#00ffff] glitch-text" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="group relative px-8 py-2 bg-transparent border-2 border-[#00ffff] text-[#00ffff] font-pixel text-xl hover:bg-[#00ffff] hover:text-black transition-all"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="w-5 h-5 animate-pulse" />
                      RESUME_UPLINK
                    </span>
                  </button>
                  <p className="text-[10px] text-[#00ffff]/40 animate-pulse tracking-widest uppercase mt-4">Press SPACE to toggle state</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 text-[10px] text-[#00ffff]/30 tracking-[0.3em] uppercase">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>CMD: ARROWS</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>CMD: SPACE</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
