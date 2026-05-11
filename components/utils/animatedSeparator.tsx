"use client";

import React from "react";

type SeparatorSize = "sm" | "md" | "lg";

interface AnimatedSeparatorProps {
	text?: string;
	sizeConfig?: SeparatorSize;
	className?: string;
}

export const AnimatedSeparator = ({
	text,
	sizeConfig = "md",
	className = "",
}: AnimatedSeparatorProps) => {
	
	const scales = {
		sm: { gap: "gap-2", text: "text-[9px]", margin: "my-4" },
		md: { gap: "gap-4", text: "text-[10px]", margin: "my-6" },
		lg: { gap: "gap-6", text: "text-[12px]", margin: "my-8" },
	};

	const current = scales[sizeConfig];

	return (
		<div 
			className={`
				flex items-center w-full
				${current.gap} ${current.margin} ${className}
			`}
		>
			{/* Left Line - Increased height to 1.5px and opacity to 100% for visibility */}
			<div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-border" />

			{/* Text Content */}
			{text && (
				<span className={`
					font-bold uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap
					${current.text}
				`}>
					{text}
				</span>
			)}

			{/* Right Line */}
			<div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border to-border" />
		</div>
	);
};