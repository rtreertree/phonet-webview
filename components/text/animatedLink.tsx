"use client";

import React from "react";

interface AnimatedLinkProps {
	text: string;
	onClick?: () => void;
	className?: string;
	prefixText?: string; 
	align?: "left" | "center" | "right";
	weight?: "medium" | "semibold" | "bold";
	disableAnimation?: boolean;
}

export const AnimatedLink = ({
	text,
	onClick,
	className = "",
	prefixText,
	align = "left",
	weight = "semibold",
	disableAnimation = false,
}: AnimatedLinkProps) => {
	
	const alignmentMap = {
		left: "justify-start text-left",
		center: "justify-center text-center",
		right: "justify-end text-right",
	};

	const weightMap = {
		medium: "font-medium",
		semibold: "font-semibold",
		bold: "font-bold",
	};

	return (
		<div className={`flex items-center gap-1.5 text-sm ${alignmentMap[align]} ${className}`}>
			{prefixText && (
				<span className="text-muted-foreground whitespace-nowrap">
					{prefixText}
				</span>
			)}

			<button
				type="button"
				onClick={onClick}
				className={`
					group relative outline-none transition-colors duration-300
					text-primary hover:text-primary/80
					/* Forcefully kill all default decorations */
					!no-underline !outline-none
					${weightMap[weight]}
				`}
				// The most aggressive way to prevent browser underlines
				style={{ 
					textDecoration: 'none', 
					textDecorationLine: 'none',
					WebkitTextDecorationLine: 'none' 
				}}
			>
				{text}
				
				{/* Custom Animated Underline - Only renders if NOT disabled */}
				{!disableAnimation && (
					<span 
						className="absolute -bottom-0.5 left-0 h-[1.5px] w-full scale-x-0 bg-primary transition-transform duration-300 ease-out origin-left group-hover:scale-x-100" 
						aria-hidden="true"
					/>
				)}
			</button>
		</div>
	);
};