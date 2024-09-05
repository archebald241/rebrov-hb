import React, { useEffect, useRef, useCallback } from "react";
import styles from "./styles.module.scss";

const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<
        Array<{
            x: number;
            y: number;
            emoji: string;
            speed: number;
            angle: number;
        }>
    >([]);
    const animationFrameRef = useRef<number | null>(null);

    const initParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const emojis = ["🎉"];
        const particles = [];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                speed: 1 + Math.random() * 3,
                angle: Math.random() * Math.PI * 2,
            });
        }

        particlesRef.current = particles;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle) => {
            ctx.font = "20px Arial";
            ctx.fillText(particle.emoji, particle.x, particle.y);

            particle.y += particle.speed;
            particle.x += Math.sin(particle.angle) * 0.5;

            if (particle.y > canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * canvas.width;
            }
        });

        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        initParticles();
        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [initParticles, animate]);

    return <canvas ref={canvasRef} className={styles.confettiCanvas} />;
};

export default Confetti;
