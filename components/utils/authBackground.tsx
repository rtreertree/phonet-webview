"use client";
import { useEffect, useRef } from "react";

export const AuthBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();

        const particles: any[] = [];
        for (let i = 0; i < 48; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
            });
        }

        let animId: number;
        function draw() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }
            animId = requestAnimationFrame(draw);
        }
        draw();
        window.addEventListener("resize", setSize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", setSize);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-50" />
            <div className="pointer-events-none fixed -left-20 -top-20 z-0 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-[80px]" />
            <div className="pointer-events-none fixed -bottom-20 -right-20 z-0 h-[400px] w-[400px] animate-pulse rounded-full bg-accent/10 blur-[80px] [animation-delay:2s]" />
        </>
    );
};