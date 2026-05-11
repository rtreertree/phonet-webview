"use client";

import React from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

interface AnimatedCardProps {
	children: React.ReactNode;
	padding?: CardPadding;
	maxWidth?: string;
	className?: string;
	delay?: string; // e.g., "0.1s", "200ms"
}

export const AnimatedCard = ({
	children,
	padding = "md",
	maxWidth = "460px",
	className = "",
	delay = "0s",
}: AnimatedCardProps) => {
	
	const paddingMap = {
		none: "p-0",
		sm: "p-4",
		md: "p-8",
		lg: "p-10",
	};

	return (
		<>
			<style>{`
				@keyframes floatIn {
					0% { 
						opacity: 0; 
						transform: translateY(30px) scale(0.98); 
						filter: blur(10px);
					}
					100% { 
						opacity: 1; 
						transform: translateY(0) scale(1); 
						filter: blur(0);
					}
				}
				.animate-float-in {
					animation: floatIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
					opacity: 0; /* Ensures it stays hidden until animation starts */
				}
			`}</style>

			<div
				style={{ maxWidth, animationDelay: delay }}
				className={`
					animate-float-in relative z-10 w-full 
					rounded-[28px] border border-border 
					bg-card/80 backdrop-blur-xl shadow-2xl 
					transition-all duration-500
					${paddingMap[padding]}
					${className}
				`}
			>
				{/* Subtle Inner Glow Border */}
				<div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />
				
				{/* Content Slot */}
				<div className="relative z-10">
					{children}
				</div>
			</div>
		</>
	);
};