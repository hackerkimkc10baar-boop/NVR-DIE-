import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  opacity: number;
  color: string;
}

export const CherryBlossom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];
    const petalCount = 45;

    // Elegant cherry blossom colors: soft pastel pinks, rose blush, and pure white sakura
    const petalColors = [
      'rgba(255, 183, 197, ',  // classic sakura pink
      'rgba(255, 192, 203, ',  // pastel pink
      'rgba(255, 218, 224, ',  // blush white
      'rgba(255, 235, 240, ',  // pure white sakura
      'rgba(255, 160, 180, ',  // deep sakura
    ];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize petals
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 1.0 - 0.5,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.03 + 0.015,
        opacity: Math.random() * 0.55 + 0.35,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }

    // Interactive gentle breeze from mouse
    let windOffset = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      windOffset = normalizedX * 1.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw realistic sakura petal shape
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.flipAngle), 1); // 3D flip effect

      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.beginPath();
      // Curved teardrop sakura petal
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();

      // Soft petal vein
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, p.size * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.015;

      petals.forEach(p => {
        // Natural swaying oscillation
        const sway = Math.sin(step + p.x * 0.01) * 0.8;
        p.x += p.speedX + sway + windOffset * 0.5;
        p.y += p.speedY;
        p.angle += p.angularSpeed;
        p.flipAngle += p.flipSpeed;

        // Wrap around when falling past bottom or side edges
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = canvas.width + 20;
        }

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-15 w-full h-full overflow-hidden"
    />
  );
};
